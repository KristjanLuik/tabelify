// import ReactGA from 'react-ga';

import MainScene from "./components/MainScene";
import TextureMapper from "./components/TextureMapper";
import Logo from "./components/Logo";
import { AppProvider } from "./appContext.tsx";

import './App.css'



function App() {
//const TRACKING_ID = "G-62FR2ML7Q9";
//ReactGA.initialize(TRACKING_ID);

  return (
    <>
        <AppProvider>
            <Logo/>
            <span>Su tag{import.meta.env.GTAG}</span>
            <div className="App">
                <MainScene/>
                <TextureMapper/>
            </div>
        </AppProvider>
    </>
  )
}

export default App
