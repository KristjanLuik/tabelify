'use strict'

import React, {useEffect, useState} from 'react'
import { CompactPicker } from 'react-color'
import { useAppContext, AppContext} from "../../appContext";

export default function ColorPicker() {
    const { setAppState, appState } = useAppContext(AppContext) as { setAppState: (appState: AppState) => void, appState: AppState };
    const [background, setBackground] = useState('#fff');
    //const [displayColorPicker, setDisplayColorPicker] = useState(false);

    const handleChangeComplete = (color: { hex: string; }) => {
        setBackground(color.hex);
        setAppState({ ...appState, background: { ...appState.background, useBackground: true,  color: color.hex } });
    };

    const handleClick = () => {
        setAppState({ ...appState, background: { ...appState.background , active: false } });
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' || event.key === 'Enter') {
                setAppState({ ...appState, background: { ...appState.background , active: false } });
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <>
        <div style={{position: 'absolute', zIndex: 2}}>
            <div style={{position: 'fixed', top: 0, right: 0, bottom: 0, left: 0}} onClick={handleClick} />
            <CompactPicker color={background} onChangeComplete={handleChangeComplete} />
        </div>
        </>

        );
}