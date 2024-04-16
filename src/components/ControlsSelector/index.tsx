import {AppState, useAppContext} from "../../appContext.tsx";
import {LuOrbit} from "react-icons/lu";
import {Tb3DRotate} from "react-icons/tb";


export default function ControlsSelector() {
    const { appState, setAppState } = useAppContext() as { appState: AppState, setAppState: (appState: { controls: boolean }) => void };

    return (
        <div className="ControlsSelector">
            <button onClick={() => setAppState({ ...appState, controls: true })}><LuOrbit size={25} /></button>
            <button onClick={() => setAppState({ ...appState, controls: false })}><Tb3DRotate size={25}/></button>
        </div>
    );
}