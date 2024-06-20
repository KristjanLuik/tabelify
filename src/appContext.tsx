import React, {
    ReactElement,
    ReactNode,
    ReactPortal,
    createContext,
    useContext,
    useState,
    useRef, useMemo,
} from "react";

interface Props {
    children: string | number | boolean | ReactElement | Iterable<ReactNode> | ReactPortal | null | undefined,
    bgrmworker?: React.MutableRefObject<Worker | null>
    worker?: Worker
}

export interface AppState {
    background: {
        color: string;
        active: boolean;
        useBackground: boolean;
    };
    controls: {
        active: boolean;
        control: Control;
    };
    imageBlob: Blob | null,
    uploadedUrl: string
    workers: {
        [key: string]: Worker;
    }
    BackgroundStatus: BackgroundEvent;

}

export enum Control {
    Orbit,
    Rotate,
}

export enum BackgroundEvent {
    None,
    DoBackgroundRemoval,
    Processing,
}



const AppContext = createContext({});
const AppProvider = (props: Props) => {
    //const worker = useRef<Worker | null>(null);
    const canvasCache = useRef<OffscreenCanvas | null>(null);
    /*worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
    });*/

    const canvas =  document.createElement('canvas').transferControlToOffscreen();
    canvasCache.current = canvas;
    const worker1 = useMemo(() => new Worker(new URL('./worker.js', import.meta.url), { type: 'module'}), []);
    worker1.postMessage({ state: 'init', canvas}, [canvas]);
    //worker.current.postMessage({ state: 'init', canvas}, [canvas]);

    const [appState, setAppState] = useState(
        {
            uploadedUrl: '',
            controls: {
                active: false,
                control: Control.Orbit,
            },
            background: {
                active: false,
                useBackground: false,
                color: '#fff'
            },
            imageBlob: null,
            workers: {
                bgrm: worker1
            },
            BackgroundStatus: BackgroundEvent.None

        } as AppState);

    return (
        <AppContext.Provider value={{appState, setAppState}}>
            {props.children}
        </AppContext.Provider>
    );
}

const useAppContext = () => {
    return useContext(AppContext);
}

export {AppProvider, useAppContext, AppContext};