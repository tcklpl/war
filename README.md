# War Game

[![GitHub Project](https://img.shields.io/badge/Github-Project-blue?logo=github)](https://github.com/users/tcklpl/projects/1)
[![Changelog Badge](https://img.shields.io/badge/Changelog-8A2BE2)](./CHANGELOG.md)
[![GitHub Pages Deploy](https://img.shields.io/badge/Github%20Pages-Latest%20Dev%20Build-blue?logo=github)](https://tcklpl.github.io/war/)

This is the browser version of a class-based war2-inspired game made using Bun, Vite, Typescript and WebGPU.

The game was initially created with `crate-react-app`, and was later ejected so I could configure it to import shader
files and run webpack with `tsc --build`. As of version `0.4.0`, all `cra`-related dependencies and configurations were
removed and the project now runs on `bun` with `vite`.

The server, as of version `0.4.0` also runs on `bun` and all server executables are compiled using `bun`.

# Running

You can get the latest binaries on the releases page.

> [!WARNING]
> The game and server are still in **early** development and are probably broken and/or incomplete.
>
> The game will be playable when the major version gets bigger than `0` eg. `1.0.0`

# Starting in Dev Mode

> [!NOTE]  
> You need to have the latest stable [Bun](https://bun.sh/) installed on your system.
> (you can upgrade your install with `bun upgrade`)

### Game

```sh
cd game
bun install
bun start
```

### Server

```sh
cd server
bun install
bun start
```
