import './i18next';
import WarGameComponent from './components/war_game_component';
import './style/globals.scss';
import '@fontsource/roboto/400.css';
import { HashRouter } from 'react-router-dom';
import Hooks from './hooks';

function App() {
    return (
        <div className='App'>
            <Hooks>
                <HashRouter>
                    <WarGameComponent />
                </HashRouter>
            </Hooks>
        </div>
    );
}

export default App;
