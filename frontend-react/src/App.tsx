import WarCanvas from './components/canvas';
import LoadingScreen from './components/loading/loading_screen';
import './style/globals.scss';
import '@fontsource/roboto/400.css';

function App() {
    return (
        <div className="App">
            <LoadingScreen />
            <WarCanvas />
        </div>
    );
}

export default App;
