import { memo, useCallback, useEffect, useRef } from "react";
import { InvalidCanvasError } from "../errors/engine/initialization/invalid_canvas";
import { WebGPUUnsupportedError } from "../errors/engine/initialization/webgpu_unsupported";
import { WarGame } from "../game/war_game";
import { useTranslation } from "react-i18next";
import { useGame } from "../hooks/use_game";
import { useCrash } from "../hooks/use_crash";

const WarCanvas = memo(() => {

    const ref = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<HTMLCanvasElement>(null);
    const { t } = useTranslation([ "engine" ]);
    const { setGameInstance } = useGame();
    const { setEngineInitializationCrash } = useCrash();

    const getContext = useCallback(async () => {
        if (!ref.current || !glRef.current) throw new InvalidCanvasError(t("engine:invalid_canvas"));
        globalThis.gameCanvas = ref.current;

        if (!navigator.gpu) throw new WebGPUUnsupportedError(t("engine:unsupported_webgpu"));
        
        const adapter = await navigator.gpu?.requestAdapter();
        if (!adapter) throw new WebGPUUnsupportedError(t("engine:disabled_webgpu"));

        // check if we can render to a rg11b10ufloat texture. If it's possible it'll be preferred, as is uses 32 bits per pixel,
        // compared from 64 from a rgba16f texture.
        const canRenderToRG11B10 = adapter.features.has("rg11b10ufloat-renderable");

        const device = await adapter?.requestDevice({
            requiredFeatures: [
                ...(canRenderToRG11B10 ? ["rg11b10ufloat-renderable" as GPUFeatureName] : [])
            ]
        });
        if (!device) throw new WebGPUUnsupportedError(t("engine:unsupported_webgpu"));

        globalThis.device = device;

        const gpuCtx = gameCanvas.getContext("webgpu");
        if (!gpuCtx) throw new WebGPUUnsupportedError(t("engine:unsupported_webgpu"));
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

        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        getContext().then(() => {
            const gameInstance = WarGame.initialize();
            setGameInstance(gameInstance);
        })
        .catch((error: Error) => {
            console.error(error);
            setEngineInitializationCrash(error);
        });

        // to run when unmounting the component
        return () => {
            game.kill();
            setGameInstance(undefined);
        }
    }, [ setGameInstance, setEngineInitializationCrash, getContext ]);

    return (
        <>
            <canvas ref={ref} className="war-canvas"></canvas>
            <canvas ref={glRef} style={{ display: 'none' }}></canvas>
        </>
    );
});

export default WarCanvas;