import ReactGA from 'react-ga4';
/* eslint-disable */
import MainScene from "./components/MainScene";
import TextureMapper from "./components/TextureMapper";
import Logo from "./components/Logo";
import {AppProvider} from "./appContext.tsx";
import { ToastContainer } from 'react-toastify';

import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import BottomMenu from "./components/BottomMenu/BottomMenu.tsx";

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
            <BottomMenu/>
            <ToastContainer />
        </AppProvider>
    </>
  )
}

export default App
