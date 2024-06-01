import ReactGA from 'react-ga4';

import MainScene from "./components/MainScene";
import TextureMapper from "./components/TextureMapper";
import Logo from "./components/Logo";
import { AppProvider } from "./appContext.tsx";
import ReportCompleteSnackbar from "./components/NotificationTypes/ReportComplete/ReportComplete.tsx"
import { SnackbarProvider } from 'notistack'

import './App.css'
import ProgressLoader from "./components/NotificationTypes/ProgressLoader/ProgressLoader.tsx";




function App() {
    if (import.meta.env.PROD) {
        ReactGA.initialize(import.meta.env.VITE_GTAG);
        ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
    }

    return (
        <>
            <AppProvider>
            <SnackbarProvider
                Components={{
                    reportComplete: ReportCompleteSnackbar,
                    progressLoader: ProgressLoader
                }}
            >
            <Logo/>
            <div className="App">
                <MainScene/>
                <TextureMapper/>
            </div>
            </SnackbarProvider>
        </AppProvider>
    </>
  )
}

export default App
