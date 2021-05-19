import quantize from 'quantize'

// fork of
/*
 * Color Thief v2.3.2
 * by Lokesh Dhakar - http://www.lokeshdhakar.com
 *
 * Thanks
 * ------
 * Nick Rabinowitz - For creating quantize.js.
 * John Schulz - For clean up and optimization. @JFSIII
 * Nathan Spady - For adding drag and drop support to the demo page.
 *
 * License
 * -------
 * Copyright Lokesh Dhakar
 * Released under the MIT license
 * https://raw.githubusercontent.com/lokesh/color-thief/master/LICENSE
 *
 * @license
 */

const validateOptions = options =>  {
    let { colorCount, quality } = options;

    if (typeof colorCount === 'undefined' || !Number.isInteger(colorCount)) {
        colorCount = 10;
    } else if (colorCount === 1 ) {
        throw new Error('colorCount should be between 2 and 20. To get one color, call getColor() instead of getPalette()');
    } else {
        colorCount = Math.max(colorCount, 2);
        colorCount = Math.min(colorCount, 20);
    }

    if (typeof quality === 'undefined' || !Number.isInteger(quality) || quality < 1) {
        quality = 10;
    }

    return {
        colorCount,
        quality
    }
};

const createPixelArray = (imgData, pixelCount, quality) => {
    const pixels = imgData;
    const pixelArray = [];

    for (let i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
        offset = i * 4;
        r = pixels[offset + 0];
        g = pixels[offset + 1];
        b = pixels[offset + 2];
        a = pixels[offset + 3];

        // If pixel is mostly opaque and not white
        if (typeof a === 'undefined' || a >= 125) {
            if (!(r > 250 && g > 250 && b > 250)) {
                pixelArray.push([r, g, b]);
            }
        }
    }

    return pixelArray;
};

const canvasGetData = image => {
    const canvas  = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width  = image.naturalWidth;
    canvas.height = image.naturalHeight;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return context.getImageData(0, 0, canvas.width, canvas.height);
};

const processBuffer = buffer => {
    const uInt8Array = new Uint8Array(buffer);

    const count = uInt8Array.length;

    let binaryString = new Array(count);

    for (let i = 0; i < uInt8Array.length; i++){
        binaryString[i] = String.fromCharCode(uInt8Array[i]);
    }

    let data = binaryString.join('');

    return btoa(data);
};

const loadImage = async (url) => {
    const resp = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        // Origin: 'https://topinterns.saleem.dev'
    });


    const type = resp.headers.get('Content-Type');
    const base64Flag = `data:${type};base64,`;

    const buffer = await resp.arrayBuffer();

    return base64Flag + processBuffer(buffer);
};

const getPalette = (image, colorCount, quality) => {

    const options = validateOptions({
        colorCount,
        quality
    });

    console.log(options.colorCount);

    const imageData = canvasGetData(image);

    const pixelCount = image.width * image.height;
    const pixelArray = createPixelArray(imageData.data, pixelCount, options.quality);

    // using median cut algorithm
    const cmap = quantize(pixelArray, options.colorCount);
    return cmap ? cmap.palette() : null;
}

const getColors2 = async (url, colorCount, quality = 10) => {
    const img = document.createElement("img");

    const data = await loadImage(url);

    // wait fot image to be loaded
    await new Promise(resolve => {
        img.addEventListener("load", () => resolve(true));
        img.src = data;
        img.alt = "";
        img.crossOrigin = "Anonymous";
    });

    return getPalette(img, colorCount, quality);
};

const getColor = async (url, quality = 10) => {
    const palette = await getColors2(url, 5, quality);
    return palette[0];
};


export {
    getColors2,
    getColor
};