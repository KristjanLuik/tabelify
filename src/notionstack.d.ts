import { VariantOverrides } from 'notistack';
declare module 'notistack' {
    interface VariantOverrides {
        // removes the `warning` variant
        warning: false;
        // adds `myCustomVariant` variant
        myCustomVariant: true;
        // adds `reportComplete` variant and specifies the
        // "extra" props it takes in options of `enqueueSnackbar`
        reportComplete: {
            allowDownload: boolean
        }
        progressLoader: {
            progress: number
        }
    }
}