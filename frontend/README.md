# War Game - Frontend

[CREDITS](./CREDITS.md)

This project was created using [create-react-app](https://create-react-app.dev/) and later ejected so I
could configure the file loader to load shader files as text.

This is my own engine implementation based on the sources listed [on the credits page](./CREDITS.md). The engine uses typescript and WebGPU
with WGSL shaders.

# Supported engine asset formats

Asset type | Supported format(s) | Extra info
---|---|---
Meshes | glTF 2 | Required to also export tangents when generating the glTF file
Cameras | glTF 2 |
Lights | glTF 2 | Currently only directional lights are supported, point and spot are TODO
Materials | glTF 2 | Materials are basically Blender's Principled BSDFs, textures are still TODO
Scenes | glTF 2 | 
Animations | TODO (will be glTF 2) | TODO
Skyboxes / Cubemaps | HDR | 

> The main asset type used is and will be glTF 2, as it can easily contain a lot of stuff like meshes, cameras, lights etc. That otherwise would each require a separate file and loader. And some logic on top of that to attach materials to meshes and so on, using glTF files is just easier.

> **Remember to export glTF files with "+Y as up" and "include tangents"** (if the file has meshes) **options**. You can export in either embedded (.gltf) or binary (.glb) format, I will be using embedded as I develop the loader and later on switch to binary when the loader is complete, as the binary files are smaller.

