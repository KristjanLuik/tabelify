/* eslint-disable */
import {AutoProcessor, AutoModel, RawImage} from '@xenova/transformers';



const EXAMPLE_URL = 'https://images.pexels.com/photos/5965592/pexels-photo-5965592.jpeg?auto=compress&cs=tinysrgb&w=1024';

/**
 * This class uses the Singleton pattern to ensure that only one instance of the
 * pipeline is loaded. This is because loading the pipeline is an expensive
 * operation and we don't want to do it every time we want to translate a sentence.
 */
class RemoveBGWorker {
    static model = null;
    static processor = null;

    static async getInstance(progress_callback = null) {
        if (this.model === null) {
            this.model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
                // Do not require config.json to be present in the repository
                config: { model_type: 'custom' },
                progress_callback,
            });

            this.processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
                // Do not require config.json to be present in the repository
                config: {
                    do_normalize: true,
                    do_pad: false,
                    do_rescale: true,
                    do_resize: true,
                    image_mean: [0.5, 0.5, 0.5],
                    feature_extractor_type: "ImageFeatureExtractor",
                    image_std: [1, 1, 1],
                    resample: 2,
                    rescale_factor: 0.00392156862745098,
                    size: { width: 1024, height: 1024 },
                }
            });
        }

        return this;
    }
}
let canvas, rmbg;
// Listen for messages from the main thread
self.addEventListener('message', async (event) => {

    console.log(`state: ${event.data.state} canvas: ${canvas} canvas in event: ${event.data.canvas}`);
    if (!canvas && event.data.state !== 'init') {
        self.postMessage({ state: 'error', message: 'Canvas not initialized'});
        return;
    }
    if (event.data.state === 'process' && rmbg === undefined) {
        self.postMessage({ state: 'error', message: 'model not initialized'});
        return;
    }
    switch (event.data.state) {
        case 'init':
            if (event.data.canvas && !canvas) {
                console.log("setting canvas");
                canvas = event.data.canvas;
            }
            break;

        case 'load':
             rmbg =  await RemoveBGWorker.getInstance(x => {
                // We also add a progress callback to the pipeline so that we can
                // track model loading.
                self.postMessage({ state: 'progress', progress: x });
            });
            break

        case 'process':
            const imageBlob = event.data.image;
            //const image = await RawImage.fromBlob(imageBlob);
            const image = await RawImage.fromURL(imageBlob);

            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');

            const { pixel_values } = await rmbg.processor(image);
            const { output } = await rmbg.model({ input: pixel_values });
            console.log("output: ", output);
            const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(image.width, image.height);
            ctx.drawImage(image.toCanvas(), 0, 0);

            // Update alpha channel
            const pixelData = ctx.getImageData(0, 0, image.width, image.height);
            for (let i = 0; i < mask.data.length; ++i) {
                pixelData.data[4 * i + 3] = mask.data[i];
            }
            ctx.putImageData(pixelData, 0, 0);
            const blob = await new Promise(resolve => canvas.convertToBlob().then(resolve));
            const urlasi = URL.createObjectURL(blob);
            self.postMessage({ state: 'processingDone', processedBlob: blob, processedUrl: urlasi });
            break;
        default:
            console.error('Unknown state:', event.data.state)
            break;
    }




   /* const rmbg =  await RemoveBGWorker.getInstance(x => {
        // We also add a progress callback to the pipeline so that we can
        // track model loading.
        self.postMessage(x);
    });

    const image = await RawImage.fromURL(EXAMPLE_URL);
    // Set container width and height depending on the image aspect ratio
    const ar = image.width / image.height;
    //const [cw, ch] = (ar > 720 / 480) ? [720, 720 / ar] : [480 * ar, 480];
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');

    const { pixel_values } = await rmbg.processor(image);
    console.log("pixel_values: ", pixel_values);
    const { output } = await rmbg.model({ input: pixel_values });
    console.log("output: ", output);
    const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(image.width, image.height);

    // Draw original image output to canvas
    ctx.drawImage(image.toCanvas(), 0, 0);

    // Update alpha channel
    const pixelData = ctx.getImageData(0, 0, image.width, image.height);
    for (let i = 0; i < mask.data.length; ++i) {
        pixelData.data[4 * i + 3] = mask.data[i];
    }
    ctx.putImageData(pixelData, 0, 0);
    console.log("canvas: ", canvas);
    const blob = await new Promise(resolve => canvas.convertToBlob().then(resolve));
    const urlasi = URL.createObjectURL(blob);

    self.postMessage({
        status: 'complete',
        mask: mask,
        image: image,
        blob: blob,
        urlasi: urlasi,
    });*/
});
