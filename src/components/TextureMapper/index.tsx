import {useEffect, useRef} from "react";
import { useAppContext } from "../../appContext.tsx";
import "./TextureMapper.css";

export default function TextureMapper() {
    const weight = 600;
    const aspectRatio = 16/9;
    const newHeight = weight / aspectRatio;
    // @ts-expect-error yes
    const { appState, setAppState } = useAppContext();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        window.addEventListener("paste", function(e){
            retrieveImageFromClipboardAsBlob(e, function(imageBlob){
                if(imageBlob){
                    const canvas = document.getElementById("textureMapper") as HTMLCanvasElement;
                    if (!canvas) {
                        console.error("Canvas not found");
                        return;
                    }
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        console.error("Canvas 2d context not found");
                        return;
                    }

                    const img = new Image();

                    img.onload = function(){
                        // Clear the canvas
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        // Draw the image
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    };

                    const URLObj = window.URL || window.webkitURL;
                    img.src = URLObj.createObjectURL(imageBlob);
                    setAppState({ ...appState, uploadedUrl: img.src });
                }
            });
        }, false);
        return () => {
            console.log("TextureMapper unmounted");
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
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.getElementById("textureMapper") as HTMLCanvasElement;
                if (!canvas) {
                    console.error("Canvas not found");
                    return;
                }
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    console.error("Canvas 2d context not found");
                    return;
                }

                // Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw the image
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = e.target?.result as string;
        };
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
            <canvas id="textureMapper" width={weight} height={newHeight}></canvas>
            <button onClick={handleButtonClick}>Turn to Table</button>
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