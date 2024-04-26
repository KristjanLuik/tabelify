import {AppState, Control, useAppContext} from "../../appContext.tsx";
import {LuOrbit} from "react-icons/lu";
import {Tb3DRotate} from "react-icons/tb";
import ColorPicker from "../ColorPicker";


export default function Controls() {
    const {appState, setAppState} = useAppContext() as {
        appState: AppState,
        setAppState: (appState: AppState) => void
    };
    console.log(appState.background);
    return (
        <div className="Controls">
            <button onClick={() => setAppState({...appState, controls: {control: Control.Orbit}})}><LuOrbit size={25}/>
            </button>
            <button onClick={() => setAppState({...appState, controls: {control: Control.Rotate}})}><Tb3DRotate
                size={25}/></button>
            <div className="background">
                <button className={`bg bg-${appState.background.useBackground}`} onClick={() => setAppState({
                ...appState,
                background: {...appState.background, active: !appState.background.active}
            })}>bg</button><small onClick={() => setAppState({
                ...appState,
                background: {...appState.background, useBackground: !appState.background.useBackground}})}>rm</small> </div>
            {appState.background.active && <ColorPicker/>}
        </div>
    );
}