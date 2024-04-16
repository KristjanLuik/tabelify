import {ReactElement, ReactNode, ReactPortal, createContext, useContext, useState} from "react";

interface Props { children: string | number | boolean | ReactElement | Iterable<ReactNode> | ReactPortal | null | undefined; }

export interface AppState {
    uploadedUrl: string;
    controls: boolean;
}

const AppContext = createContext({});
const AppProvider = (props: Props) => {
    const [appState, setAppState] = useState({ uploadedUrl: '', controls: true} as AppState);

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