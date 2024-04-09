import {ReactElement, ReactNode, ReactPortal, createContext, useContext, useState} from "react";

interface Props { children: string | number | boolean | ReactElement | Iterable<ReactNode> | ReactPortal | null | undefined; }


const AppContext = createContext({});
const AppProvider = (props: Props) => {
    const [state, setState] = useState({ uploadedUrl: ''} as { uploadedUrl: string });

    return (
        <AppContext.Provider value={{state, setState}}>
            {props.children}
        </AppContext.Provider>
    );
}

const useAppContext = () => {
    return useContext(AppContext);
}

export { AppProvider, useAppContext, AppContext};