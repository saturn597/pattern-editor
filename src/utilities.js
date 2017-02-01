
/*** Manipulating canvases based on arrays of boolean "pixels" ***/

function pixelsToCanvas(w, h, pixels) {
    // Return a canvas of specified height and width
    // Pixels is a boolean array of length up to h * w specifying whether
    // each pixel is "on" (white) or "off" (black).
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(w, h);

    pixels.forEach((p, i) => {
        const start = i * 4;
        if (p) {
            imageData.data.fill(255, start, start + 4);
        } else {
            imageData.data.fill(0, start, start + 3);
            imageData.data[start + 3] = 255;
        }
    });

    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

function scaleCanvas(oldCanvas, xScale, yScale) {
    // scale a canvas by integer factors > 1

    const oldCtx = oldCanvas.getContext('2d');
    const oldData = oldCtx.getImageData(0, 0, oldCanvas.width, oldCanvas.height);

    const newCanvas = document.createElement('canvas');
    newCanvas.width = oldCanvas.width * xScale;
    newCanvas.height = oldCanvas.height * yScale;

    const newCtx = newCanvas.getContext('2d');
    const newData = newCtx.createImageData(newCanvas.width, newCanvas.height);

    for (let y = 0; y < oldCanvas.height; y++) {
        for (let x = 0; x < oldCanvas.width; x++) {
            for (let i = 0; i < yScale; i++) {
                for (let j = 0; j < xScale; j++) {
                    let oldIndex = 4 * (x + y * oldCanvas.width);
                    let newIndex = 4 * (x * xScale + j + (y * yScale + i) * newCanvas.width);
                    newData.data.set(oldData.data.slice(oldIndex, oldIndex + 4), newIndex);
                }
            }
        }
    }

    newCtx.putImageData(newData, 0, 0);

    return newCanvas;
}


/*** Creating compressed versions of "pixel" arrays ***/

function padToString(num, radix, desiredLength) {
    // Like the method toString on a number "num", but left-pads the result
    // with 0's to hit a specified length.

    let result = num.toString(radix);
    const diff = desiredLength - result.length;
    if (diff > 0) {
        result = '0'.repeat(diff) + result;
    }

    return result;
}

function fromUrl(str) {
    // Reverse the operation in toUrl - take a string and convert it to pixels.
    // Assumes a string representing pixels in base 32.

    const a = str.slice(0, 7);
    const b = str.slice(7);

    const conv = (str) => padToString(parseInt(str, 32), 2, 32);

    return Array.prototype.map.call(conv(a) + conv(b), (c) => c === '1');
}

function toUrl(pixels) {
    // Take a series of pixels and convert it to a string format.

    pixels = pixels.map((p) => p ? '1' : '0').join('');

    // That gives us a basic string, but let's convert the "binary" to base 32
    // to shorten.

    const conv = (str) => padToString(parseInt(str, 2), 32, 7);

    const a = pixels.slice(0, 32);  // Split it in two so we don't overflow
    const b = pixels.slice(32);

    return conv(a) + conv(b);
}


export { fromUrl, toUrl, pixelsToCanvas, scaleCanvas };
