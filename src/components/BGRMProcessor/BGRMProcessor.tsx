/* eslint-disable */
import { Notifications } from "@mui/icons-material";
import {useEffect, useRef } from "react";
import {BackgroundEvent, useAppContext} from "../../appContext.tsx";
import { Button } from "@mui/material";
import {toast} from "react-toastify";

import './BGRMProcessor.css';


export default function BGRMProcessor() {
    // @ts-expect-error yes
    const { appState, setAppState } = useAppContext();
    const toastId = useRef<string | number | null>(null);

    const { bgrm } = appState.workers;
    useEffect(() => {
        if (!bgrm) {
            console.log('no worker', bgrm);
            return;
        }

        // Create a callback function for messages from the worker thread.
        // @ts-expect-error yes
        const onMessageReceived = (e) => {
            console.log('onMessageReceived', e);
            switch (e.data.state) {
                case 'progress':
                    if (e.data.progress.progress) {
                        const progressPercent = e.data.progress.progress / 100;

                        if (toastId.current === null) {
                            toastId.current = toast('Downloading BGRM model', { progress: progressPercent });
                        } else {
                            toast.update(toastId.current, { progress: progressPercent });
                        }
                    }
                    break;

                case 'done':
                    // Model file loaded: remove the progress item from the list.
                    //setProgressItems(
                    //    prev => prev.filter(item => item.file !== e.data.file)
                    //);
                    console.log('done');
                    break;

                case 'ready':
                    // Pipeline ready: the worker is ready to accept messages.
                    // setReady(true);
                    console.log('ready');
                    break;

                case 'update':
                    // Generation update: update the output text.
                    //setOutput(e.data.output);
                    break;

                case 'processingDone':
                    console.log('processingDone');
                    setAppState({ ...appState, BackgroundStatus: BackgroundEvent.None,});
                    document.body.appendChild(document.createElement('img')).src = e.data.processedUrl;
                    break;

                case 'processing':
                    // Generation update: update the output text.
                    console.log('processing');

                    break;

                case 'error':
                    toast(`Error:  ${e.data.message}`, { type: 'error' });
                    break;
            }
        };


        // Attach the callback function as an event listener.
        bgrm.addEventListener('message', onMessageReceived);

        // Define a cleanup function for when the component is unmounted.
        return () => {
            if (bgrm) {
                bgrm.removeEventListener('message', onMessageReceived);
            }
        }
    });

    useEffect(() => {
        if (appState.BackgroundStatus != BackgroundEvent.DoBackgroundRemoval) {
           return;
        }
        if (!appState.uploadedUrl) {
            toast('Please upload an image first', { type: 'warning' });
            return;
        }
        setAppState({ ...appState, BackgroundStatus: BackgroundEvent.Processing });
        bgrm.postMessage({ state: 'process', image: appState.uploadedUrl });
    }, [appState.BackgroundStatus]);

    return (
        <div className="BGRMProcessor">
                <Notifications fontSize={"small"} />
                <span>To use AI for Background removal ~30Mb</span>
                <Button size={"small"} variant={"contained"} onClick={() => {
                    bgrm.postMessage({ state: 'load'});
                }}>Install</Button>
        </div>
    );
}