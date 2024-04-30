import React, {useEffect, useRef, createRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useAppContext } from "../../appContext.tsx";
import "./TextureMapper.css";

export default function TextureMapper() {
    const weight = 600;
    const aspectRatio = 16/9;
    const newHeight = weight / aspectRatio;
    // @ts-expect-error yes
    const { appState, setAppState } = useAppContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cropperRef = createRef<ReactCropperElement>();

    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            setAppState({ ...appState, uploadedUrl: cropperRef.current?.cropper.getCroppedCanvas().toDataURL()});
        }
    };

    useEffect(() => {
        const pasteHandler = (e: ClipboardEvent) => {
            retrieveImageFromClipboardAsBlob(e, function(imageBlob){
                if(imageBlob){
                    const URLObj = window.URL || window.webkitURL;
                    setAppState({ ...appState, uploadedUrl: URLObj.createObjectURL(imageBlob), imageBlob: imageBlob});
                }
            });
        }

        window.addEventListener("paste", pasteHandler, false);

        return () => {
            window.removeEventListener("paste", pasteHandler);
        }
    });


    const handleButtonClick = () => {
        // trigger click event of the file input
        fileInputRef.current?.click();
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.readAsDataURL(file);

        // handle the file here
        // for example, create an object URL and set it as uploadedUrl
        const url = URL.createObjectURL(file);
        setAppState({ ...appState, uploadedUrl: url });
    };


    return (
        <div className="TextureMapper">
            <h1>Texture Mapper</h1>
            <p>Paste or upload an image to map it to a 3D object.</p>
            <div className="img-preview"></div>
            <Cropper
                className="cropper"
                ref={cropperRef}
                style={{ height: newHeight, width: weight }}
                zoomTo={0.5}
                initialAspectRatio={aspectRatio}
                preview=".img-preview"
                src={appState.uploadedUrl}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                guides={true}
            />
            <button onClick={getCropData} disabled={appState.uploadedUrl == ""}>Do Crop</button>
            <button onClick={handleButtonClick}>Upload Pic</button>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
}

function retrieveImageFromClipboardAsBlob(pasteEvent: ClipboardEvent, callback: { (imageBlob: Blob | null): void; (arg0: undefined): void; }){
    // @ts-expect-error yes
    if(pasteEvent.clipboardData == false){
        if(typeof(callback) == "function"){
            callback(undefined);
        }
    }

    const items = pasteEvent.clipboardData?.items;

    if(items == undefined){
        if(typeof(callback) == "function"){
            callback(undefined);
        }
        return;
    }

    for (let i = 0; i < items.length; i++) {
        // Skip content if not image
        if (items[i].type.indexOf("image") == -1) continue;
        // Retrieve image on clipboard as blob
        const blob = items[i].getAsFile();

        if(typeof(callback) == "function"){
            callback(blob);
        }
    }
}
