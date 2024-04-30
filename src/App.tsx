// import ReactGA from 'react-ga';

import MainScene from "./components/MainScene";
import TextureMapper from "./components/TextureMapper";
import Logo from "./components/Logo";
import { AppProvider } from "./appContext.tsx";

import './App.css'



function App() {
//const TRACKING_ID = "G-62FR2ML7Q9";
//ReactGA.initialize(TRACKING_ID);
console.log(import.meta.env)
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
