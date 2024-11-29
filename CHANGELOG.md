# War Changelog

<!--
    Changelog Sections:
        New         for new features.
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

- 🖥 Server now saves a crashlog if it crashes by an unhandled exception.
- 🖥 Server logger is now fully customizable through the config file `server.json5`.
- 🎮 **Shadow Filtering**: Configurable between Off (None), Low (PCF) and Medium (PCSS + PCF).
- 🎮🔩 Entity Flag System, for 32 possible boolean flags.
- 🎮 **Outlines**: Accessible via the new Entity Flag system.

### 🔨 Fixed

- 🎮 Fixed game ESC menu `Grid2` error.
- 🎮🔩 Shadow map size is now clamped to (try to) prevent the user from fucking shit up.
- 🎮 Optimized directional lights to only do 1 `writeBuffer` call.
- 🎮 Fixed "Failed to get config" error when first loading the page.
- 🎮🔩 Fixed some naming inconsistencies.

### 🔧 Changed

- 🔩 GitHub Actions will now mark all closed versions as normal releases.
- 🎮 Game shadow atlas resolution increased from 0.5k-4k to 1k-8k.
- 🎮🔩 Renamed `RenderHDRBufferChain` to `TextureBufferChain` and made it more generic.
- 🎮🔩⬆️ Updated `@vitejs/plugin-react-swc` to `3.7.2`.
- 🎮🔩⬆️ Updated `@vitest/coverage-v8` to `2.1.6`.
- 🎮🔩⬆️ Updated `eslint` to `9.15.0`.
- 🎮🔩⬆️ Updated `happy-dom` to `15.11.7`.
- 🎮🔩⬆️ Updated `prettier` to `3.4.1`.
- 🎮🔩⬆️ Updated `typescript` to `5.7.2`.
- 🎮🔩⬆️ Updated `vite` to `6.0.1`.
- 🎮🔩⬆️ Updated `vite-tsconfig-paths` to `5.1.3`.
- 🎮🔩⬆️ Updated `vitest` to `2.1.6`.
- 🎮🔩⬆️ Updated `@emotion/react` to `11.13.5`.
- 🎮🔩⬆️ Updated `@emotion/styled` to `11.13.5`.
- 🎮🔩⬆️ Updated `@mui/icons-material` to `6.1.9`.
- 🎮🔩⬆️ Updated `@mui/lab` to `6.0.0-beta.17`.
- 🎮🔩⬆️ Updated `@mui/material` to `6.1.9`.
- 🎮🔩⬆️ Updated `@petamoriken/float16` to `3.9.0`.
- 🎮🔩⬆️ Updated `i18next` to `24.0.2`.
- 🎮🔩⬆️ Updated `react-i18next` to `15.1.2`.
- 🎮🔩⬆️ Updated `react-router-dom` to `7.0.1`.

## [0.4.0] - 2024-11-15

### ✨ New

- 🖥🔩 Added dependency `drizzle-orm`.
- 🖥🔩 Added dependency `tasai`.
- 🖥🔩 Added dev dependency `drizzle-kit`.
- 🖥🔩 Added dev dependency `@types/bun`.
- 🎮🔩 Added dev dependency `vite`.
- 🎮🔩 Added dev dependency `@vitejs/plugin-react-swc`.
- 🎮🔩 Added dev dependency `vite-tsconfig-paths`.
- 🎮🔩 Added dev dependency `vite-plugin-svgr`.
- 🎮🔩 Added dev dependency `vitest`.
- 🎮🔩 Added dev dependency `happy-dom`.
- 🎮🔩 Added dev dependency `@vitest/coverage-v8`.
- 🎮🔩 Added dev dependency `@tauri-apps/cli`.
- 🔩 Created a `version` script to change the project version across all packages.

### 🔨 Fixed

- 🎮🔩 Fixed some components to properly import all `i18n` namespaces they're using.

### 🔧 Changed

- 🖥🔩 Replaced `node` and `npm` with `bun`.
- 🖥🔩 `json5` import changed from esm to cjs.
- 🖥🔩 Replaced `sql.js + typeorm` with bun's own `sqlite3` and `drizzle-orm`.
- 🖥🔩 Updated all server code to comply with `verbatimModuleSyntax`.
- 🖥🔩 Updated all server scripts to use bun.
- 🎮🔩 Replaced `webpack` with `vite`.
- 🎮🔩 Removed hack to get build version from env, as now we can use Vite to define variables.
- 🎮🔩 Moved dependency `typescript` to dev dependencies.
- 🎮🔩 Updated scripts to use `vitest`.
- 🔩 Updated `README` to better reflect the state of the project.
- 🎮🖥🔩 Started using ts path remapping, for now implemented `:protocol`, `:engine`, `:hooks` and `:icons`.
- 🎮🔩⬆️ Updated `@types/react` to `18.3.12`.
- 🎮🔩⬆️ Updated `@types/react-dom` to `18.3.1`.
- 🎮🔩⬆️ Updated `@webgpu/types` to `0.1.51`.
- 🎮🔩⬆️ Updated `typescript` to `5.6.3`.
- 🎮🔩⬆️ Updated `@mui/icons-material` to `5.16.7`.
- 🎮🔩⬆️ Updated `@mui/lab` to `6.0.0-beta.15`.
- 🎮🔩⬆️ Updated `@mui/material` to `6.1.7`.
- 🎮🔩⬆️ Updated `react-router-dom` to `6.28.0`.
- 🎮🔩⬆️ Updated `recharts` to `2.13.3`.
- 🎮🔩⬆️ Updated `socket.io-client` to `4.8.1`.
- 🎮🔩⬆️ Updated `@fontsource/roboto` to `5.1.0`.
- 🎮🔩⬆️ Updated `@mui/icons-material` to `6.1.7`.
- 🎮🔩⬆️ Updated `i18next` to `23.16.5`.
- 🎮🔩⬆️ Updated `react-i18next` to `15.1.1`.
- 🎮🖥⬆️ Updated `typescript-eslint` to `8.14.0`.
- 🔩 `pettier` now formats `json` and `json5` files with 2-space tabs. The rest of the files are 4-space tabs.

### ❌ Removed

- 🖥🔩 Removed dependency `typeorm`.
- 🖥🔩 Removed dependency `reflect-metadata`.
- 🖥🔩 Removed dependency `sql.js`.
- 🖥🔩 Removed dependency `chalk`.
- 🖥🔩 Removed dev dependency `nodemon`.
- 🖥🔩 Removed dev dependency `ts-node`.
- 🖥🔩 Removed dev dependency `pkg`.
- 🖥🔩 Removed dev dependency `husky`.
- 🖥🔩 Removed dev dependency `fs-jetpack`.
- 🖥🔩 Removed dev dependency `copyfiles`.
- 🖥🔩 Removed dev dependency `@swc/core`.
- 🖥🔩 Removed dev dependency `@swc/helpers`.
- 🖥🔩 Removed dev dependency `replace-in-file`.
- 🎮🔩 Removed dependency `@babel/core`.
- 🎮🔩 Removed dependency `babel-jest`.
- 🎮🔩 Removed dependency `babel-loader`.
- 🎮🔩 Removed dependency `babel-plugin-named-asset-import`.
- 🎮🔩 Removed dependency `babel-preset-react-app`.
- 🎮🔩 Removed dependency `@pmmmwh/react-refresh-webpack-plugin`.
- 🎮🔩 Removed dependency `@svgr/webpack`.
- 🎮🔩 Removed dependency `case-sensitive-paths-webpack-plugin`.
- 🎮🔩 Removed dependency `css-minimizer-webpack-plugin`.
- 🎮🔩 Removed dependency `eslint-webpack-plugin`.
- 🎮🔩 Removed dependency `html-webpack-plugin`.
- 🎮🔩 Removed dependency `terser-webpack-plugin`.
- 🎮🔩 Removed dependency `webpack`.
- 🎮🔩 Removed dependency `webpack-dev-server`.
- 🎮🔩 Removed dependency `webpack-manifest-plugin`.
- 🎮🔩 Removed dependency `workbox-webpack-plugin`.
- 🎮🔩 Removed dependency `postcss`.
- 🎮🔩 Removed dependency `postcss-flexbugs-fixes`.
- 🎮🔩 Removed dependency `postcss-loader`.
- 🎮🔩 Removed dependency `postcss-normalize`.
- 🎮🔩 Removed dependency `postcss-preset-env`.
- 🎮🔩 Removed dependency `resolve`.
- 🎮🔩 Removed dependency `resolve-url-loader`.
- 🎮🔩 Removed dependency `camelcase`.
- 🎮🔩 Removed dependency `css-loader`.
- 🎮🔩 Removed dependency `dotenv`.
- 🎮🔩 Removed dependency `dotenv-expand`.
- 🎮🔩 Removed dependency `mini-css-extract-plugin`.
- 🎮🔩 Removed dependency `sass`.
- 🎮🔩 Removed dependency `sass-loader`.
- 🎮🔩 Removed dependency `style-loader`.
- 🎮🔩 Removed dependency `source-map-loader`.
- 🎮🔩 Removed dependency `tailwindcss`.
- 🎮🔩 Removed dependency `fs-extra`.
- 🎮🔩 Removed dependency `bfj`.
- 🎮🔩 Removed dependency `browserslist`.
- 🎮🔩 Removed dependency `eslint-config-react-app`.
- 🎮🔩 Removed dependency `file-loader`.
- 🎮🔩 Removed dependency `identity-obj-proxy`.
- 🎮🔩 Removed dependency `jest`.
- 🎮🔩 Removed dependency `jest-environment-jsdom`.
- 🎮🔩 Removed dependency `jest-resolve`.
- 🎮🔩 Removed dependency `jest-watch-typeahead`.
- 🎮🔩 Removed dependency `semver`.
- 🎮🔩 Removed dependency `@types/node`.
- 🎮🔩 Removed dependency `i18next-resources-to-backend`.
- 🎮🔩 Removed dependency `prompts`.
- 🎮🔩 Removed dependency `react-refresh`.
- 🎮🔩 Removed dev dependency `husky`.
- 🎮🔩 Removed dev dependency `@types/jest`.
- 🎮🔩 Removed dev dependency `electron`.
- 🎮🔩 Removed dev dependency `electron-builder`.
- 🎮🔩 Removed dev dependency `raw.macro`.

## [0.3.1] - 2024-11-10

### 🔨 Fixed

- 🖥 Fixed server not bundling with sqlite3 by replacing it with sql.js.

## [0.3.0] - 2024-11-09

### ✨ New

- 🔩 Wrote build and dev scripts for the server.
- 🎮🔩 Animation builder through `AnimationBuilder`.
- 🎮🔩 Animation engine initial implementation.
- 🎮 Country animations for hovering on and off.

### 🔨 Fixed

- 🖥 Server now properly shows the current version on the banner.
- 🖥🔩 Server now also validates if it can find the config defaults when extracting.
- 🔩 Removed a few inline initializations from the server.
- 🔩 Made a bunch of stuff `readonly`.

### 🔧 Changed

- 🔩 Renamed Protocol's output folder to `out`.
- 🎮🔩⬆️ Updated `@emotion/react` to `11.13.3`.
- 🎮🔩⬆️ Updated `@emotion/styled` to `11.13.0`.
- 🎮🔩⬆️ Updated `@mui/material` to `6.0.2`.
- 🎮🔩 Quaternion functions now return a new Quaternion instead of modifying.
- 🎮🔩 Changed credits screen MUI `Grid` to `Grid2`.
- 🖥🔩⬆️ Updated `@eslint/js` to `9.12.0`.
- 🖥🔩⬆️ Updated `@swc/core` to `1.7.26`.
- 🖥🔩⬆️ Updated `@swc/helpers` to `0.5.13`.
- 🖥🔩⬆️ Updated `@types/jsonwebtoken` to `9.0.7`.
- 🖥🔩⬆️ Updated `eslint` to `9.12.0`.
- 🖥🔩⬆️ Updated `eslint-plugin-prettier` to `5.2.1`.
- 🖥🔩⬆️ Updated `globals` to `15.10.0`.
- 🖥🔩⬆️ Updated `husky` to `9.1.6`.
- 🖥🔩⬆️ Updated `nodemon` to `3.1.7`.
- 🖥🔩⬆️ Updated `prettier` to `3.3.3`.
- 🖥🔩⬆️ Updated `replace-in-file` to `8.2.0`.
- 🖥🔩⬆️ Updated `typescript-eslint` to `8.8.1`.
- 🖥🔩⬆️ Updated `express` to `4.21.0`.
- 🖥🔩⬆️ Updated `socket.io` to `4.8.0`.
- 🎮 Moved pause menu button text alignment to the right.
- 🎮 Moved the button to go back to the main menu into the config screen.

### ❌ Removed

- 🎮 Removed Trello link, as the project is now on Github Projects.

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
