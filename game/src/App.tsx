import '@fontsource/roboto/400.css';
import { HashRouter } from 'react-router-dom';
import WarGameComponent from './components/war_game_component';
import Hooks from './hooks';
import './i18next';
import './style/globals.scss';

function App() {
    return (
        <div className='App'>
            <Hooks>
                <HashRouter
                    future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true,
                    }}
                >
                    <WarGameComponent />
                </HashRouter>
            </Hooks>
        </div>
    );
}

export default App;
