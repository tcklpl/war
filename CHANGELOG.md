# War Changelog

<!--
    Changelog Sections:
        Added       for new features.
        Changed     for changes in existing functionality.
        Deprecated  for soon-to-be removed features.
        Removed     for now removed features.
        Fixed       for any bug fixes.
        Security    in case of vulnerabilities.
-->

War changelog, according to [Keep a Changelog](https://keepachangelog.com) and [Semantic Versioning](https://semver.org/). This file will be updated as the development continues.

A lot of progress tracking was lost because I didn't think to do this sooner.

Icons:

- 🎮 Game-related.
- 🖥 Server-related.
- 🔩 Dev-related.
- ⬆️ Package or dependency update.

## [Unreleased]

### ✨ New

- 🔩 Wrote build and dev scripts for the server.
- 🎮🔩 Animation builder through `AnimationBuilder`.

### 🔨 Fixed

- 🖥 Server now properly shows the current version on the banner.
- 🖥🔩 Server now also validates if it can find the config defaults when extracting.
- 🔩 Removed a few inline initializations from the server.

### 🔧 Changed

- 🔩 Renamed Protocol's output folder to `out`.
- 🎮🔩⬆️ Updated `@emotion/react` to `11.13.3`.
- 🎮🔩⬆️ Updated `@emotion/styled` to `11.13.0`.
- 🎮🔩⬆️ Updated `@mui/material` to `6.0.2`.
- 🎮🔩 Quaternion functions now return a new Quaternion instead of modifying.
- 🎮🔩 Changed credits screen MUI `Grid` to `Grid2`.

## [0.2.0] - 2024-07-29

### ✨ New

- 🎮🖥 The game owner can now **pause** the game at any point.
- 🎮🖥 The game will be automatically paused if any player leaves.
- 🖥 Support for Initial territory selection to be paused and resumed.
- 🎮 Reworked the lobby selection screen to look better.
- 🎮🔩 Started implementing smoke-screen tests to UI components and menus.
- 🎮🔩 New game compilation targets: `AppImage` for linux and `mas` for macOS.
- 🔩 GitHub workflow now also compiles for linux and mac.
- 🎮🖥 The game owner can now **save** the game at any point.

### 🔨 Fixed

- 🖥 Fixed server logging only being configured after the initialization was complete.
- 🎮 Game browser-related components (like scroll bars) now properly follow the theme.
- 🎮🔩 Fixed game dev server unnecessarily reloading the whole page.
- 🎮 Fixed a couple of bugs that caused some errors when destructing the engine.
- 🎮🔩 Game no longer loses connection to the server when the page is hot-reloaded.
- 🎮 Game now properly returns to lobby list when the game context is lost/invalidated.

### 🔧 Changed

- 🎮🔩 Asset loading no longer depends on an instance of WebGL2 to get some constants.
- 🎮🔩⬆️ Updated React to `18.3.1`.
- 🎮🔩⬆️ Updated Material UI and Material Icons to `5.15.21`.
- 🎮🔩⬆️ Updated Socket.io to `4.7.5`.
- 🎮🔩⬆️ Updated Typescript to `5.5.3`.
- 🎮🔩⬆️ Updated Jest and all its relations to `29.7.0`.
- 🎮🔩⬆️ Updated Testing Library: Jest DOM to `6.4.6`.
- 🎮🔩⬆️ Updated Testing Library: React to `16.0.0`.
- 🎮🔩⬆️ Updated Testing Library: User Event to `14.5.2`.
- 🎮🔩⬆️ Updated i18next to `22.5.1`.
- 🎮🔩⬆️ Updated react-i18next to `12.3.1`.
- 🎮🔩⬆️ Updated electron to `31.2.0`.
- 🔩 Dev-build GitHub workflow now checkouts from master.
- 🔩 Renamed some variables to be more consistent throughout the project.

### ❌ Removed

- 🎮🔩 The game no longer has a global `gl` WebGL2 instance, as it was only used to get some constants during the asset loading and initialization.

## [0.1.1] - 2024-06-21

### 🔨 Fixed

- 🖥🔩 Server linter no longer accuses explicit `any` declarations.

## [0.1.0] - 2024-06-21

### ✨ New

- 🎮🖥 Clients can now reconnect to the game if their token hasn't expired.
- 🔩 Release notes on the releases page.

### 🔨 Fixed

- 🎮 Fixed the assets not being loaded correctly if the URL had an `/#/`.
- 🎮🖥 Connection can now be established on different socket ports.
- 🎮🖥 Synchronized version across game, server and protocol.
- 🖥 Fixed server crashing when two sockets try to connect with the same username.

### 🔧 Changed

- 🖥 Reworked the server-side game handling logic to be better structured.
- 🎮 Updated all game hooks to use `memo`s.
- 🎮 The game will now always try to ping a server when connecting to it, even if the ping was already successful.
- 🎮 Reworked client-side logic to directly call react state setters.

## [0.0.3]

### ✨ New

- 🔩 GitHub pages deploy.

### 🔧 Changed

- 🔩 Improved the readme.
