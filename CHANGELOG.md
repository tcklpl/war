# War Changelog

War changelog, this file will be updated as the development continues.

A lot of progress tracking was lost because I didn't think to do this sooner.

## [Unreleased]

### 🔨 Fixed

- 🎮 Fixed the assets not being loaded correctly if the URL had an `/#/`.
- 🎮🖥 Connection can now be established on different socket ports.
- 🎮🖥 Synchronized version across game, server and protocol.

### 🔧 Modified

- 🖥 Reworked the server-side game handling logic to be better structured.
- 🎮 Updated all game hooks to use `memo`s.
- 🎮 The game will now always try to ping a server when connecting to it, even if the ping was already successful.
- 🎮 Reworked client-side logic to directly call react state setters.

## [0.0.3]

### ✨ New

- GitHub pages deploy.

### 🔧 Modified

- Improved the readme.
