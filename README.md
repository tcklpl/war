# War Game

[![GitHub Project](https://img.shields.io/badge/Github-Project-blue?logo=github)](https://github.com/users/tcklpl/projects/1)
[![Changelog Badge](https://img.shields.io/badge/Changelog-8A2BE2)](./CHANGELOG.md)
[![GitHub Pages Deploy](https://img.shields.io/badge/Github%20Pages-Latest%20Dev%20Build-blue?logo=github)](https://tcklpl.github.io/war/)

This is the browser version of a class-based war2-inspired game made using Bun, Vite, Typescript and WebGPU.

The game was initially created with `crate-react-app`, and was later ejected so I could configure it to import shader
files and run webpack with `tsc --build`. As of version `0.4.0`, all `cra`-related dependencies and configurations were
removed and the project now runs on `bun` with `vite`. The game binaries were also migrated
from `electron` to `tauri` in `0.4.0`.

The server, as of version `0.4.0` also runs on `bun` and all server executables are compiled using `bun`.

# Running

You can get the latest binaries on the releases page.

> [!WARNING]
> The game and server are still in **early** development and are probably broken and/or incomplete.
>
> The game will be playable when the major version gets bigger than `0` eg. `1.0.0`

### Game

You can either install and run the game locally or access it through the GitHub Pages link on
the top of this file. All game configuration can be done through the config menu while
running the game.

### Server

It's advisable to put the server binary inside a separated folder, as it will extract some
files when first starting. These files include:

- **Public and Private keys**: used to validate tokens and generated randomly when the server
  starts and they are not present.
- **gamedata.db**: general sqlite db used for storing game data.
- **config folder**: folder containing all server configuration in `json5`.

Initially you should configure `config/server.json5` to specify your server name and password:

```js
name: 'My Server',
password: '',
description: 'My Server Description',
```

# Starting in Dev Mode

> [!NOTE]  
> You need to have the latest stable [Bun](https://bun.sh/) installed on your system.
> (you can upgrade your install with `bun upgrade`)

### Game

```sh
bun install
cd game
bun start
```

### Server

```sh
bun install
cd server
bun start
```

# Building

### Game

```sh
bun install
cd game
bun run build
```

This will generate the vite build under `game/build`. This step is enough for deploying to
a web server, but if you want to compile the executables/installers check the game executables
section below.

### Server

```sh
bun install
cd server
bun run build
```

This will generate binaries for Windows, Linux and MacOS under `server/dist`.

### Game Executables/Installers

Building the game only generates a web build, if you wish to do actually compile `tauri`s
executables, you need to do the following:

> [!NOTE]  
> On top of [Bun](https://bun.sh/), you also **need** to have [Rust](https://www.rust-lang.org/)
> installed on your system, as `tauri` is built with Rust.

> [!WARNING]
> If you're compiling for **linux**, you need to have the following packages installed on your
> system: `libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf`. Windows and Mac
> builds don't have library prerequisites.

```sh
bun install
cd game
bun run build
bun compile
```

This will build the final executables at `game/src-tauri/target/release/bundle/<format>`.

Beware that this will only compile the executables for your machine, cross-compilation is not
possible with this configuration. Compilation for all platforms is done though Github Actions.
