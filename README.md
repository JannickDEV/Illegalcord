# [<img src="./browser/Illegalcord.png" width="40" align="left" alt="Illegalcord">](https://github.com/JannickDEV/Illegalcord) Illegalcord (curated JannickDEV build)

**A curated build of [Illegalcord](https://github.com/ImHisako/Illegalcord) with its most heavily rule-breaking and
risky plugins removed, made to run inside [my Dorion build](https://github.com/JannickDEV/Dorion).**

> [!IMPORTANT]
> This is an **unofficial, personal build** I share with friends. It is not made or supported by ImHisako
> (Illegalcord), Equicord, Vencord or Discord. Don't report problems with it to those projects.
> See [Reporting problems](#reporting-problems).

> [!WARNING]
> **Every Discord client mod breaks Discord's [Terms of Service](https://discord.com/terms).** This build
> removes the plugins most likely to get an account banned, which lowers the risk without removing it.
> Use it at your own risk.

## How to use it

You don't install this repository directly. **Install [Dorion (JannickDEV build)](https://github.com/JannickDEV/Dorion#setup)**
and turn on **Illegalcord** under *Client Mods*. Dorion then downloads the latest `browser.js` from this repository's
[`latest` release](https://github.com/JannickDEV/Illegalcord/releases/tag/latest) every time it starts, so you're
always on the newest reviewed version without updating anything yourself.

The release is built by GitHub Actions from the source in this repository. Nothing in it was compiled or
uploaded by hand.

## Removed plugins

These 22 plugins from upstream Illegalcord are **not** in this build:

| Why | Plugins |
|---|---|
| **Downloaded or ran unverified programs or scripts** on your PC | GhostSelfbot (downloads and launches a selfbot `.exe`, and can hand it your token) · StereoInstaller (replaces Discord's voice engine with a modified binary from a third party) · FloeP2PService (`irm … \| iex` installer) · StatusCycler (`curl \| sh` installer, automatic status changes) · ShareClientConfig (importing someone's config could switch on risky settings) |
| **High ban risk** (selfbot or automation behaviour) | NitroSniper · NitroSniper Nighty Ver · MassMention · AutoModBypass · DontLimitMe · ServerCloner · PlatformSpoofer · FakeMuteAndDeafen · BoosterCount · ClanSwitcher · MutualScanner · DetectBlock · SendTrail |
| **Watching other people** | Surveillance · Stalker · OSINTToolkit · PresenceLab |

The list, with reasons, is also kept in [FORK_NOTES.md](FORK_NOTES.md), and the daily safety check keeps these plugins out
when upstream changes them.

## What's included

Everything from [Equicord's plugin list](https://equicord.org/plugins) (which includes Vencord's), plus these Illegalcord plugins:

<details>
<summary><b>Illegalcord plugins in this build</b></summary>

**Privacy and security**
- **DiscordHardened**: blocks trackers, hardens Discord's settings, warns about dangerous attachments *(on by default)*
- **StreamProofEnhanched**: hides sensitive chat content while you screen share *(on by default)*
- **WebRTCLeakPrevent**: forces relay-only voice connections so peers can't see your IP
- **ZeroWidthSanitizer**: strips invisible fingerprinting characters from messages
- **ScamLinkDetector**: warns about known scam links (Discord AntiScam list)
- **DiscordLock**: password-locks Discord on startup, after inactivity, or for chosen servers
- **Securecord**, **SecurecordOpossum**, **IGP** (PGP): end-to-end encrypted messages between people who share a key
- **SecureBookmarks**: encrypted message bookmarks

**Voice, streaming and media**
- **StereoScreenshareAudio**: stereo audio when watching streams
- **ScreenShareAlert**: notifies you when someone in your voice channel starts sharing
- **CustomStreamTopQ**: custom stream preview images
- **SoundPad**: plays audio files through a virtual microphone (needs VB-Cable)
- **FastGifPicker**, **EmbeddedURLs**: lighter GIF picker, embeddable social links

**Quality of life**
- **TypingFriends**, **FollowUser**, **SilentGroupCall**, **SilentEdit**, **SilentDelete**, **OpSec** (autocorrect), **PluginStars**
- **IllegalMessageLogger**: keeps deleted and edited messages
- **StaffDetector**: highlights Discord staff in voice channels
- **ConsoleCleaner**, **DisableAnimations**, **Hisako's Optimizations**, **OpenOptimizer**, **GatewayLogger**

**Cosmetic (only you see these)**
- **LarpCord**, **BadgeSelector**, **ServerBadges**, **ExpandedWidgets**, **IllegalcordEasterEgg**, **GhostClient**, **1FA**

**Illegalcord itself**
- **IllegalcordTutorial**, **IllegalcordAnnouncements**, **NightcordPort**, **CrashHandlerEnhanced**

**Desktop-only.** These are in the source, but have no effect in Dorion because they need native (system-level) code:
AnonLi, ClientDiagnostics, ClientIcon, ConfigEditor, CustomDNS, GpuBinder, IllegalcordDynamicIsland, MultiInstance
(use Dorion profiles instead), PrivateSearchBrowser, RamOptimizer, SecureZipper, SoundcloudRPC, VoiceServerInfo, YMusicSync,
BetterMicrophone, BetterScreenshare.

</details>

## Safety and risks

**Review.** Upstream Illegalcord was reviewed before this build was made. Every use of the Discord token, every
network request, all native code and every shipped binary were checked. No malware, token stealing or hidden
upload was found in Illegalcord's own code. What made it risky were plugins that download and run other projects'
programs, or that exist to break Discord's rules. Those are gone.

**Still worth knowing:**
- Some included plugins still change Discord's behaviour (SilentDelete, SilentEdit, SilentGroupCall, FollowUser, GhostClient).
  They're common and low-risk, but not risk-free.
- Message loggers keep things other people chose to delete. Please respect that.
- When Discord starts, badge lists are downloaded from GitHub (ImHisako's repo) and `api.nightcord.st`. Those
  hosts see your IP address. Equicord and Vencord do the same with their own badge services. Plugins you turn on may
  talk to the service they're built for, for example VoiceServerInfo, which looks up the voice server's location.

**Daily update check.** Once a day an automated Claude session (AI-assisted, on my account) fetches upstream Illegalcord
and runs [`scripts/forkSafetyCheck.mjs`](scripts/forkSafetyCheck.mjs). It then reads every flagged change and every new
plugin, and merges only when nothing unsafe was found. New rule-breaking plugins are removed before merging. If
anything is unclear, nothing is merged and I review it myself. It's a strong filter, not a guarantee.

## Reporting problems

Open an issue here, or message me (JannickDEV) directly. **Report security problems privately**, not in public.
Never send anyone your Discord token or password, and nobody legitimate will ask for them. See [SECURITY.md](SECURITY.md).

## For developers

Building works as described in upstream's README: `pnpm install --frozen-lockfile`, then `pnpm buildWeb`. The browser bundle is
written to `dist/browser/`. [FORK_NOTES.md](FORK_NOTES.md) lists every change compared with upstream and how to sync manually.

## Credits

- [ImHisako](https://github.com/ImHisako) and contributors for [Illegalcord](https://github.com/ImHisako/Illegalcord)
- [thororen1234](https://github.com/thororen1234) for creating [Equicord](https://github.com/Equicord)
- [Vendicated](https://github.com/Vendicated) for creating [Vencord](https://github.com/Vendicated/Vencord)
- [verticalsync](https://github.com/verticalsync) for creating [Suncord](https://github.com/verticalsync/Suncord)
- [clrxxo](https://github.com/clrxxo) for creating [Kamidere](https://github.com/clrxxo/Kamidere)
- [Nightcord](https://nightcord.st/) for the ideas and foundations of several plugins
- The authors of the individual plugins, credited in each plugin's source

## License

GNU GPL v3, same as upstream. See [LICENSE](LICENSE). The full source of every build is in this repository.

Not affiliated with or endorsed by Discord Inc.
