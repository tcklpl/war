# War Changelog

War changelog, this file will be updated as the development continues.

A lot of progress tracking was lost because I didn't think to do this sooner.

## [Unreleased]

### ✨ New

- 🖥 Initial territory selection can now be paused and resumed.

### 🔨 Fixed

- 🖥 Fixed server logging only being configured after the initialization was complete.
- 🎮🔩 Fixed game dev server unnecessarily reloading the whole page.
- 🎮 Fixed a couple of bugs that caused some errors when destructing the engine.

### 🔧 Modified

- 🎮🔩 Updated React to `18.3.1`.
- 🎮🔩 Updated Material UI and Material Icons to `5.15.21`.
- 🎮🔩 Updated Socket.io to `4.7.5`.
- 🎮🔩 Asset loading no longer depends on an instance of WEbGL2 to get some constants.

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

### 🔧 Modified

- 🖥 Reworked the server-side game handling logic to be better structured.
- 🎮 Updated all game hooks to use `memo`s.
- 🎮 The game will now always try to ping a server when connecting to it, even if the ping was already successful.
- 🎮 Reworked client-side logic to directly call react state setters.

## [0.0.3]

### ✨ New

- 🔩 GitHub pages deploy.

### 🔧 Modified

- 🔩 Improved the readme.
