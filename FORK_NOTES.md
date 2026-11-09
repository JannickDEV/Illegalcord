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

## Other changes
- `.github/workflows/build.yml`: the release upload runs unless the repository variable `ACT` is `true`.
  Upstream needed `ACT=false` to be set explicitly, so forks never published a release.

## Updating from upstream

```bash
git remote add upstream https://github.com/ImHisako/Illegalcord.git
git fetch upstream
git merge upstream/main
```

If the merge brings a removed plugin back, delete it again. Before pushing, look over any new
plugins in `src/illegalcordplugins/`, especially new `native.ts` files and network calls.
