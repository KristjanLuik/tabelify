import ReactGA from 'react-ga4';

import MainScene from "./components/MainScene";
import TextureMapper from "./components/TextureMapper";
import Logo from "./components/Logo";
import { AppProvider } from "./appContext.tsx";

import './App.css'



function App() {
    if (import.meta.env.PROD) {
        ReactGA.initialize(import.meta.env.VITE_GTAG);
        ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
    }

    return (
        <>
            <AppProvider>
            <Logo/>
            <div className="App">
                <MainScene/>
                <TextureMapper/>
            </div>
        </AppProvider>
    </>
  )
}

export default App
