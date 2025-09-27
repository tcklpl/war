import { WarGame } from ':game/war-game';
import { useCrash } from ':hooks/use-crash';
import { useGame } from ':hooks/use-game';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { InvalidCanvasError } from '../errors/engine/initialization/invalid-canvas';
import { useRenderTargetStore } from '../state/render-target.store';

const WarCanvas = memo(() => {
	const ref = useRef<HTMLCanvasElement>(null);
	const { t } = useTranslation(['engine']);
	const { setGameInstance } = useGame();
	const { setEngineInitializationCrash } = useCrash();
	const setRenderTargetCanvas = useRenderTargetStore(state => state.setRenderTargetCanvas);

	const getContext = useCallback(async () => {
		if (!ref.current) throw new InvalidCanvasError(t('engine:invalid_canvas'));
		setRenderTargetCanvas(ref.current);
	}, [t, setRenderTargetCanvas]);

	useEffect(() => {
		getContext()
			.then(() => {
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
		};
	}, [setGameInstance, setEngineInitializationCrash, getContext]);

	return <canvas ref={ref} className='war-canvas' />;
});

export default WarCanvas;
