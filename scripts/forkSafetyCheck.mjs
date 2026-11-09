/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 JannickDEV and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * Fork safety check: mechanical first pass over the upstream changes that a
 * merge would bring into this fork. It flags things a human (or Claude) must
 * read before merging. It does not decide on its own that a change is safe.
 *
 * Usage: node scripts/forkSafetyCheck.mjs <base-ref> <target-ref> [config.json]
 *   base-ref    what the fork has now (usually HEAD)
 *   target-ref  what would be merged (usually upstream/main)
 *   config      defaults to .github/fork-safety.json
 *
 * Exit codes: 0 = nothing flagged, 1 = flagged items need review,
 *             2 = hard block (binary added/changed, history rewritten).
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const [base, target, configPath = ".github/fork-safety.json"] = process.argv.slice(2);
if (!base || !target) {
    console.error("usage: forkSafetyCheck.mjs <base-ref> <target-ref> [config.json]");
    process.exit(64);
}

const config = JSON.parse(readFileSync(configPath, "utf8"));
const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 1 << 30 });

const mergeBase = git("merge-base", base, target).trim();
const findings = { block: [], review: [], info: [] };

// Upstream history must extend what we merged before; a rewrite is suspicious.
try {
    git("merge-base", "--is-ancestor", mergeBase, target);
} catch {
    findings.block.push(`History rewritten: merge base ${mergeBase} is not an ancestor of ${target}`);
}

const commits = git("log", "--format=%h %an: %s", `${mergeBase}..${target}`).trim();
if (!commits) {
    console.log("No new upstream commits.");
    process.exit(0);
}

const toRegex = glob => new RegExp("^" + glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*\//g, "\u0001")
    .replace(/\*\*/g, "\u0002")
    .replace(/\*/g, "[^/]*")
    .replace(/\u0001/g, "(?:.*/)?")
    .replace(/\u0002/g, ".*") + "$");
const matchesAny = (path, globs) => globs.some(g => toRegex(g).test(path));

// --- File-level checks -----------------------------------------------------
const changed = git("diff", "--name-status", "--no-renames", mergeBase, target)
    .trim().split("\n").filter(Boolean).map(line => {
        const [status, ...rest] = line.split("\t");
        return { status, path: rest.join("\t") };
    });

const numstat = new Map(git("diff", "--numstat", "--no-renames", mergeBase, target)
    .trim().split("\n").filter(Boolean).map(line => {
        const [added, , ...rest] = line.split("\t");
        return [rest.join("\t"), added === "-"];
    }));

for (const { status, path } of changed) {
    const isBinary = numstat.get(path) === true;

    if (status !== "D" && matchesAny(path, config.removedPaths ?? [])) {
        findings.review.push(`Removed plugin path touched upstream (delete it again after merging): ${path}`);
    }

    if (isBinary && status !== "D" && !matchesAny(path, config.allowedBinaryGlobs ?? [])) {
        findings.block.push(`Binary file ${status === "A" ? "added" : "changed"}: ${path}`);
    }

    if (matchesAny(path, config.sensitivePaths ?? [])) {
        findings.review.push(`Sensitive path ${status === "A" ? "added" : status === "D" ? "deleted" : "changed"}: ${path}`);
    }

    if (status === "A" && /(^|\/)native[^/]*\.[cm]?[jt]sx?$/.test(path)) {
        findings.review.push(`New native (main-process) module: ${path}`);
    }

    for (const root of config.plugins ?? []) {
        const m = path.match(new RegExp(`^${root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/([^/]+)/`));
        if (m && status === "A") {
            const dir = `${root}/${m[1]}`;
            if (!git("ls-tree", "-d", "--name-only", mergeBase, dir).trim()) {
                findings.info.push(`New plugin: ${dir}`);
            }
        }
    }
}

// --- Line-level checks on added code ------------------------------------------
const patterns = [
    [/\bchild_process\b|\bexecFile(?:Sync)?\(|\bspawn(?:Sync)?\(|\bexecSync\(|std::process::Command|Command::new\(/, "process execution"],
    [/\beval\(|new Function\(|\bWebAssembly\.(?:instantiate|compile)\(/, "dynamic code execution"],
    [/\batob\(|fromCharCode\(|Buffer\.from\([^)]*["']base64["']|\\x[0-9a-f]{2}\\x[0-9a-f]{2}/i, "decoding / possible obfuscation"],
    [/getToken\(|AuthenticationStore|tokenStore|["']authorization["']\s*:|Authorization:/i, "credential / token access"],
    [/api\/webhooks\/|discord(?:app)?\.com\/api\/webhooks/i, "Discord webhook"],
    [/\|\s*(?:iex|sh|bash)\b|Invoke-Expression|irm\s+https?:|curl\s+[^|]*\|\s*\w|powershell(?:\.exe)?\b|-ExecutionPolicy\s+Bypass/i, "remote script execution / shell"],
    [/\.(?:exe|dll|node|so|dylib|ps1|bat|cmd|scr)\b["'`]/i, "executable file reference"],
    [/Local Storage|leveldb|Login Data|\bCookies\b|\\Discord\\|discordcanary|discordptb/i, "browser / Discord profile data paths"],
    [/writeFile(?:Sync)?\(|appendFile(?:Sync)?\(|fs::write|File::create/, "file write"],
];

const ignoreForLines = config.ignoreLineChecksIn ?? [];
const urlHosts = new Map();
let currentFile = "";
const diff = git("diff", "--unified=0", "--no-renames", mergeBase, target);

for (const line of diff.split("\n")) {
    if (line.startsWith("+++ ")) {
        currentFile = line.slice(6);
        continue;
    }
    if (!line.startsWith("+") || line.startsWith("+++")) continue;
    if (matchesAny(currentFile, ignoreForLines)) continue;

    const code = line.slice(1);
    for (const [re, label] of patterns) {
        if (re.test(code)) findings.review.push(`${label}: ${currentFile}: ${code.trim().slice(0, 160)}`);
    }

    for (const m of code.matchAll(/\b(?:https?|wss?):\/\/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g)) {
        const host = m[1].toLowerCase();
        if (!urlHosts.has(host)) urlHosts.set(host, currentFile);
    }
}

// Hosts that appear nowhere in the fork today are worth a look.
const knownHosts = new Set();
for (const m of git("grep", "-hoIE", "(https?|wss?)://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", mergeBase, "--", ".")
    .matchAll(/:\/\/([a-zA-Z0-9.-]+)/g)) knownHosts.add(m[1].toLowerCase());
for (const [host, file] of urlHosts) {
    if (!knownHosts.has(host) && !(config.trustedHosts ?? []).includes(host)) {
        findings.review.push(`New external host: ${host} (first seen in ${file})`);
    }
}

// --- Dependencies --------------------------------------------------------------
for (const file of config.dependencyFiles ?? []) {
    const d = git("diff", "--unified=0", mergeBase, target, "--", file);
    const added = d.split("\n").filter(l => l.startsWith("+") && !l.startsWith("+++"));
    if (added.length) findings.review.push(`Dependency file changed: ${file} (${added.length} added lines)`);
}

// --- Report ------------------------------------------------------------------
const uniq = list => [...new Set(list)];
console.log(`# Fork safety check\n\nRange: ${mergeBase.slice(0, 10)}..${target}\n`);
console.log("## Upstream commits\n```\n" + commits + "\n```\n");
for (const [title, key] of [["BLOCK", "block"], ["Needs review", "review"], ["Info", "info"]]) {
    const items = uniq(findings[key]);
    console.log(`## ${title} (${items.length})`);
    for (const item of items.slice(0, 400)) console.log(`- ${item}`);
    if (items.length > 400) console.log(`- ... ${items.length - 400} more`);
    console.log();
}

process.exit(findings.block.length ? 2 : findings.review.length ? 1 : 0);
