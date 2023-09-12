# [War Game](../README.md) > Game

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
Images / Skyboxes / Cubemaps | Browser-loadable images | Preferably AVIF, as it supports HDR, has a small file size and is [pretty well supported](https://caniuse.com/avif).

> The main asset type used is and will be glTF 2, as it can easily contain a lot of stuff like meshes, cameras, lights etc. That otherwise would each require a separate file and loader. And some logic on top of that to attach materials to meshes and so on, using glTF files is just easier.

> **Remember to export glTF files with "+Y as up" and "include tangents"** (if the file has meshes) **options**. You can export in either embedded (.gltf) or binary (.glb) format, I will be using embedded as I develop the loader and later on switch to binary when the loader is complete, as the binary files are smaller.

# Engine rendering

Render Stage | Required | Description | Inputs | Outputs
--|--|--|--|--
Depth Map | Required | Renders the solid geometry into a depth texture | Solid geometry | Depth map
Solid Geometry | Required | Renders the solid geometry using a PBR shader and the depth map from the previous step (setting depth as 'equals') | Depth map, Solid geometry, Material info (per primitive) and Scene info (skybox, lights etc.) | HDR Color map, Normal map
Skybox | Required | Renders the scene's skybox | Depth map, Scene's skybox | HDR Color map
SSAO | Optional | Calculates SSAO | Depth map, Normal map, Random noise map | SSAO (r16f) textures: noisy and blurred
Environment | Required | Calculates IBL for the scene and merges SSAO and SSR (TODO) | Depth map, Normal map, SSAO Blurred texture | HDR Color map (blend add)
Bloom | Optional | Calculates bloom from the HDR color map | HDR Color map | Bloom texture
PFX and Tone Mapping | Required | Applies post effects (TODO) and tone maps the scene to the final color | HDR Color map, Bloom texture | Screen color
Picking | Required | Renders 1x1 pixel below the mouse to know if the user is hovering any interactable object | Solid geometry | 1x1 `r32uint` texture
