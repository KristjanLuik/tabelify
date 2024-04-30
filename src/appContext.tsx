import {ReactElement, ReactNode, ReactPortal, createContext, useContext, useState} from "react";

interface Props { children: string | number | boolean | ReactElement | Iterable<ReactNode> | ReactPortal | null | undefined; }

export interface AppState {
    uploadedUrl: string;
    imageBlob: Blob;
    controls: {
        active: boolean;
        control: Control;
    },
    background: {
        color: string;
        active: boolean;
        useBackground: boolean;
    }

}

export enum Control{
    Orbit,
    Rotate,
    Background

}

const AppContext = createContext({});
const AppProvider = (props: Props) => {
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
            }
        } as AppState);

    return (
        <AppContext.Provider value={{ appState, setAppState}}>
            {props.children}
        </AppContext.Provider>
    );
}

const useAppContext = () => {
    return useContext(AppContext);
}

export { AppProvider, useAppContext, AppContext};