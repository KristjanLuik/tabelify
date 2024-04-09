import { useEffect } from "react";
import { useAppContext } from "../../appContext.tsx";

export default function TextureMapper() {
    const aspectRatio = 16/9;
    const newHeight = 800 / aspectRatio;
    // @ts-expect-error yes
    const { setState } = useAppContext();
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
                        // Get the canvas dimensions
                        const canvasWidth = canvas.width;
                        const canvasHeight = canvas.height;

                        // Calculate the aspect ratio of the image
                        const imgAspectRatio = img.width / img.height;

                        // Calculate the new dimensions of the image.
                        // If the image is wider than the canvas, set the width to the canvas width and scale the height accordingly.
                        // If the image is taller than the canvas, set the height to the canvas height and scale the width accordingly.
                        let newWidth, newHeight;
                        if (canvasWidth / canvasHeight > imgAspectRatio) {
                            newHeight = canvasHeight;
                            newWidth = newHeight * imgAspectRatio;
                        } else {
                            newWidth = canvasWidth;
                            newHeight = newWidth / imgAspectRatio;
                        }

                        // Clear the canvas
                        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

                        // Draw the image
                        ctx.drawImage(img, 0, 0, newWidth, newHeight);
                    };

                    const URLObj = window.URL || window.webkitURL;
                    img.src = URLObj.createObjectURL(imageBlob);
                    setState({ uploadedUrl: img.src });
                    console.log("Image src", img.src);
                    console.log("Image pasted");
                }
            });
        }, false);
        return () => {
            console.log("TextureMapper unmounted");
        }
    });
    return (
        <div>
            <h1>Texture Mapper</h1>
            <p>Paste or upload an image to map it to a 3D object.</p>
            <canvas id="textureMapper" width="800" height={newHeight}></canvas>
            <button>Turn to Table</button>
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