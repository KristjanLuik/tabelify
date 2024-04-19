import './App.css'
import MainScene from "./components/MainScene";
import TextureMapper from "./components/TextureMapper";
import Logo from "./components/Logo";
import { AppProvider } from "./appContext.tsx";

function App() {

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
