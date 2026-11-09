# Security

This repository is a curated, unofficial build of [Illegalcord](https://github.com/ImHisako/Illegalcord), maintained by
JannickDEV for personal use and for friends. It is loaded by [Dorion (JannickDEV build)](https://github.com/JannickDEV/Dorion).

## Reporting a problem with this build

Message JannickDEV **privately**. Don't put security details in a public issue. Examples of what to report:
- a plugin or file that seems to send data somewhere it shouldn't
- a download from these repositories that your antivirus flags, or that differs from what the source suggests
- a plugin that should have been removed (see [README](README.md#removed-plugins)) but is still active

Include the plugin name, what you saw and when. **Never include your Discord token, password, or private messages.**
If you think your token leaked, change your Discord password, which signs out every session and invalidates the token.

## Problems that come from upstream

If the problem is in Illegalcord's own code and not specific to this build, also report it to the Illegalcord maintainers
through the contacts in [upstream's SECURITY.md](https://github.com/ImHisako/Illegalcord/blob/main/SECURITY.md).

## How this build is kept safe

- 22 upstream plugins that ran external programs, carried a high ban risk, or monitored other users are removed
  ([FORK_NOTES.md](FORK_NOTES.md)).
- Every day, new upstream changes are scanned by [`scripts/forkSafetyCheck.mjs`](scripts/forkSafetyCheck.mjs) and
  reviewed in an automated Claude session before anything is merged. Unclear changes are not merged.
- Releases are built only by GitHub Actions from this repository's source.

No review process is perfect. Treat this build like any other third-party software, and use it on an account you can
afford to lose.
