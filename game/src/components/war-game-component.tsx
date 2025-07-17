import { useConfig } from ':hooks/use-config';
import type { Theme } from '@mui/material';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import type React from 'react';
import { useEffect, useState } from 'react';
import themeDefaultDark from '../style/themes/default-dark';
import themeDefaultLight from '../style/themes/default-light';
import HUDAlert from './alert/hud-alert';
import WarCanvas from './canvas';
import HUDConfirmation from './confirmation/hud-confirmation';
import LegalDisclaimerScreen from './disclaimer/legal-disclaimer-screen';
import FailedToStartEngineScreen from './error/failed-to-start-engine/failed-to-start-engine-screen';
import HUDPerformance from './game/hud/debug/hud-performance';
import EscMenu from './game/hud/esc-menu/esc-menu';
import LoadingScreen from './loading/loading-screen';
import MenuRouter from './menu/router/menu-router';

const WarGameComponent: React.FC = () => {
	const { displayConfig } = useConfig();
	const [theme, setTheme] = useState(themeDefaultDark);

	// biome-ignore lint/correctness/useExhaustiveDependencies: need to filter theme
	useEffect(() => {
		let newTheme: Theme;
		switch (displayConfig.theme) {
			case 'light':
				newTheme = themeDefaultLight;
				break;
			case 'dark':
				newTheme = themeDefaultDark;
				break;
			default:
				newTheme = themeDefaultDark;
				break;
		}
		setTheme(newTheme);
	}, [displayConfig, theme]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline enableColorScheme />
			<LegalDisclaimerScreen />
			<FailedToStartEngineScreen />
			<LoadingScreen />
			<MenuRouter />
			<EscMenu />

			<SnackbarProvider />
			<HUDAlert />
			<HUDConfirmation />
			<HUDPerformance />
			<WarCanvas />
		</ThemeProvider>
	);
};

export default WarGameComponent;
