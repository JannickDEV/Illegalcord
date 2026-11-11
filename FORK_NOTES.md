# Curated Illegalcord fork (for Dorion)

This fork tracks `ImHisako/Illegalcord`. The browser build (`browser.js` / `browser.css`)
from the `latest` release is loaded by the `JannickDEV/Dorion` fork as the "Illegalcord"
client mod.

## Removed plugins

Removed after a source review (2026-11-09, upstream commit `6f861c0`).

**Download or run unverified third-party code**
- `GhostSelfbot`: downloads and runs the latest Ghost selfbot `.exe` and can write your token into its config
- `stereoInstaller.desktop`: replaces Discord's native voice module with a modified binary fetched from a third-party repo
- `FloeP2PService.desktop`: installs Floe with `irm https://floe.one/install.ps1 | iex`
- `statusCycler`: installs Spicetify through `curl | sh`, and changes your status automatically
- `shareClientConfig`: importing someone else's config can switch plugins on and set paths that later get executed

**High risk of an account ban (selfbot or automation behaviour)**
- `NitroSniper`, `NightyNitroSniper`: auto-redeem gifts and send captchas to paid solving services
- `MassMention`, `AutoModBypass`, `dontLimitMe`
- `serverCloner`, `platformSpoofer`, `FakeMuteAndDeafen`
- `BoosterCount-main`, `clanSwitcher`: call Discord's API with your raw token and spoofed client headers
- `mutualScanner`, `detectBlock`: automated background profile and member fetching
- `sendTrail`: bulk-deletes messages through the API

**Surveillance of other users**
- `Surveillance`, `stalker`, `OSINTToolkit` (sends looked-up user IDs to `api.cord.cat`), `presenceLab`

## Fork-owned files

These differ on purpose from upstream. On merge conflicts, keep the fork's version, and fold in upstream changes only
where they still apply. The same list is `forkOwnedFiles` in `.github/fork-safety.json`.

- `README.md`, `README_IT.md`, `SECURITY.md`: rewritten for this curated build. Upstream's describe the full Illegalcord.
- `FORK_NOTES.md`, `.github/fork-safety.json`, `scripts/forkSafetyCheck.mjs`: the fork's own tooling
- `.github/workflows/build.yml`: release condition and manual trigger, see below
- `browser/VencordNativeStub.ts`: the browser build reports `JannickDEV/Illegalcord` as its repository (Changelog page)
- `DiscordHardened/index.ts`, `webRtcLeakPrevent/index.tsx`: defaults changed so voice works in Dorion, where Discord
  uses the browser's WebRTC instead of the desktop voice engine. Device listing and speaker selection are allowed
  (otherwise "No Output Devices"), private push-to-talk is off (it kept the mic silent), and WebRTCLeakPrevent uses
  "Public (Default Discord)" (relay-only never connects, so calls stay on "RTC Connecting"). Only the defaults
  changed: anyone who already set these keeps their own values.

## Other changes
- `.github/workflows/build.yml`: the release upload runs unless the repository variable `ACT` is `true`.
  Upstream needed `ACT=false` to be set explicitly, so forks never published a release.

## Updating from upstream

A daily scheduled Claude session does this automatically. It merges only when the review is clean, and
otherwise sends you a notification and pushes nothing. To do it by hand:

```bash
git remote add upstream https://github.com/ImHisako/Illegalcord.git
git fetch upstream
node scripts/forkSafetyCheck.mjs HEAD upstream/main   # exit 0 clean, 1 review needed, 2 blocked
git merge upstream/main
```

`scripts/forkSafetyCheck.mjs` with `.github/fork-safety.json` is only a first pass: it flags things to read.
It does not prove a change is safe.

If the merge brings a removed plugin back, delete it again. Before pushing, look over any new
plugins in `src/illegalcordplugins/`, especially new `native.ts` files and network calls.
