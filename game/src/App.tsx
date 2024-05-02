import { CssBaseline, Theme, ThemeProvider } from '@mui/material';
import WarGameComponent from './components/war_game_component';
import './style/globals.scss';
import '@fontsource/roboto/400.css';
import themeDefaultDark from './style/themes/default_dark';
import { useConfig } from './hooks/use_config';
import { useEffect, useState } from 'react';
import themeDefaultLight from './style/themes/default_light';
import { HashRouter } from 'react-router-dom';


function App() {

    const { displayConfig } = useConfig();
    const [theme, setTheme] = useState(themeDefaultDark);

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
        <div className="App">
            <ThemeProvider theme={theme}>
                <HashRouter>
                    <CssBaseline/>
                    <WarGameComponent/>
                </HashRouter>
            </ThemeProvider> 
        </div>
    );
}

export default App;
