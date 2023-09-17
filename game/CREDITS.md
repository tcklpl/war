# [War Game](../README.md) > [Game](./README.md) > Game Credits

Stuff used in the game/engine and who made it.

## Assets

### glTF Assets
Asset name | File Name | Author(s) | License | Extra Info
---|---|---|---|---
Game Board | board.gltf | [Jader](https://github.com/JaderGedeon), [tcklpl](https://github.com/tcklpl) | CC0 | 

### HDR Assets
Asset name | File Name | Author(s) | License | Extra Info
---|---|---|---|---
kloofendal_43d_clear_4k | kloofendal_43d_clear_4k.AVIF | [Greg Zaal](https://gregzaal.com/) | CC0 | [File in Poly Haven](https://polyhaven.com/a/kloofendal_43d_clear). The HDR file was converted to AVIF so it could be easily loaded.
thatch_chapel_4k | thatch_chapel_4k.hdr | [Dimitrios Savva](https://polyhaven.com/all?a=Dimitrios+Savva), [Jarod Guest](https://polyhaven.com/all?a=Jarod+Guest) | CC0 | [File in Poly Haven](https://polyhaven.com/a/thatch_chapel)

## Localizations
Locale | Author(s)
---|---
en | [tcklpl](https://github.com/tcklpl)

## Projects / Repos / Articles / Interviews used as reference

> This will be updated as I search more stuff to use in the engine/game.

- [Google's Filament](https://github.com/google/filament): especially [this](https://google.github.io/filament/Filament.html) explanation page about PBR. Filament was used as the reference about PBR shaders and their implementation.

- [WebGPU Fundamentals](https://webgpufundamentals.org/): especially [this](https://webgpufundamentals.org/webgpu/lessons/webgpu-from-webgl.html) page about transitioning from WebGL to WebGPU. Also huge thanks to greggman for answering my questions both on the WebGPU Fundamentals website and on Stack Overflow.

- [Learn OpenGL](https://learnopengl.com): also used as reference about multiple effects and PBR theory.

- [Doom 2016 Graphics Study](https://www.adriancourreges.com/blog/2016/09/09/doom-2016-graphics-study/) by [Adrian Courrèges](https://www.adriancourreges.com/): the rendering engine that is being implemented in this game is heavily inspired on this article (this will probably be a simpler version of the Doom 2016 engine).

- KhronosGroup's glTF 2.0 [Specification](https://github.com/KhronosGroup/glTF/blob/main/specification/2.0/README.md) and [Tutorial](https://github.com/KhronosGroup/glTF-Tutorials/blob/master/gltfTutorial/README.md). This project heavily uses glTF files and I wrote the glTF importer based on these pages.

- [io-rgbe by David Lenaerts](https://github.com/DerSchmale/io-rgbe/): I'm using my adapted version of his loader to decode .hdr RGBE files. The list of changes and the MIT license note can be found on the file [hdr_loader.ts](./src/engine/asset/loaders/hdr_loader.ts).

