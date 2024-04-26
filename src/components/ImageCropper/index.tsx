import {useEffect, useRef, useState} from 'react';
import {AppState, useAppContext} from "../../appContext.tsx";

function ImageCropper() {
    const [crop, setCrop] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const canvasRef = useRef();
    const cropCanvasRef = useRef();
    // @ts-expect-error yes
    const { appState, setAppState } = useAppContext() as { appState: AppState };

    useEffect(() => {
        console.log(crop);
    }, [crop]);

    const handleMouseDown = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        setCrop({ ...crop, top: event.clientY - rect.top, left: event.clientX - rect.left });
    };

    const handleMouseUp = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        setCrop({ ...crop, width: event.clientX - rect.left - crop.left, height: event.clientY - rect.top - crop.top });
    };

    const handleCrop = () => {
        if (!cropCanvasRef.current) { return }
        const ctx = cropCanvasRef.current.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, crop.left, crop.top, crop.width, crop.height, 0, 0, crop.width, crop.height);
        };
        img.src = canvasRef.current.toDataURL();
        setAppState({ ...appState, uploadedUrl: canvasRef.current.toDataURL()});
    };

    useEffect(() => {
        if (!appState.imageBlob) { return }
        const canvas = canvasRef.current as unknown as HTMLCanvasElement;
        if (!canvas) { return }
        const ctx = canvas.getContext('2d');
        const URLObj = window.URL || window.webkitURL;
        const img = new Image();
        img.src = URLObj.createObjectURL(appState.imageBlob);
        //canvas.width = img.width;
        //canvas.height = img.height;

        // Draw the image onto the canvas
        //ctx.drawImage(img, 0, 0, img.width, img.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return () => {
            console.log("ImageCropper unmounted");
        }
    }, [appState.imageBlob]);

    return (
        <div>
            <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} style={{border: 'solid 1px'}}></canvas>
            <button onClick={handleCrop}>Crop</button>
            <canvas ref={cropCanvasRef}></canvas>
        </div>
    );
}

export default ImageCropper;