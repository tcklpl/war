import React, { useEffect, useRef } from "react";
import { InvalidCanvasError } from "../errors/engine/initialization/invalid_canvas";
import { WebGPUUnsupportedError } from "../errors/engine/initialization/webgpu_unsupported";
import { WarGame } from "../game/war_game";
import { useTranslation } from "react-i18next";

const WarCanvas: React.FC = () => {

    const ref = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<HTMLCanvasElement>(null);
    const { t } = useTranslation([ "engine" ]);

    useEffect(() => {
        getContext().then(() => WarGame.initialize());

        // to run when unmounting the component
        return () => {
            game.kill();
        }
    }, []);

    const getContext = async () => {
        if (!ref.current || !glRef.current) throw new InvalidCanvasError(t("engine:invalid_canvas"));
        globalThis.gameCanvas = ref.current;

        if (!navigator.gpu) throw new WebGPUUnsupportedError(t("engine:unsupported_webgpu"));
        
        const adapter = await navigator.gpu?.requestAdapter();
        if (!adapter) throw new WebGPUUnsupportedError(t("engine:disabled_webgpu"));

        const device = await adapter?.requestDevice();
        if (!device) throw new WebGPUUnsupportedError(t("engine:unsupported_webgpu"));

        globalThis.device = device;

        const gpuCtx = gameCanvas.getContext("webgpu");
        if (!gpuCtx) throw new WebGPUUnsupportedError(t("engine:unsupported_webgl2"));
        globalThis.gpuCtx = gpuCtx;

        const presentantionFormat = navigator.gpu.getPreferredCanvasFormat();
        gpuCtx.configure({
            device,
            format: presentantionFormat
        });

        // get a webgl2 instance
        // this instance will only be used to access constants such as gl.FLOAT or gl.UNSIGNED_INT (because they're used in gltf files)
        // it should NOT be used for rendering
        const glCtx = glRef.current.getContext("webgl2");
        if (!glCtx) throw new WebGPUUnsupportedError(t("engine:unsupported_webgl2"));
        globalThis.gl = glCtx;
    }

    return (
        <>
            <canvas ref={ref} className="war-canvas"></canvas>
            <canvas ref={glRef} style={{ display: 'none' }}></canvas>
        </>
    );
};

export default WarCanvas;