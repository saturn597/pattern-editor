
/*** Generally useful js utilities ***/

function bindMethods(obj, methods) {
    // Take a list of strings representing methods of obj.
    // Bind those methods to obj.
    methods.forEach((f) => {
        obj[f] = obj[f].bind(obj);
    });
}


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


/*** Dealing with string versions of "pixel" arrays ***/

function padToString(num, radix, desiredLength) {
    // This is like the method toString on a number "num", but left-pads the
    // result with 0's to hit a specified length.

    let result = num.toString(radix);
    const diff = desiredLength - result.length;
    if (diff > 0) {
        result = '0'.repeat(diff) + result;
    }

    return result;
}

function fromUrl(str, maxPixels) {
    // Reverse the operation in toUrl - take a string and convert it to pixels.

    const conv = (str) => padToString(parseInt(str, 32), 2, 32);
    const substrings = str.split('-').map(conv).join('').slice(-maxPixels);

    return Array.prototype.map.call(substrings, (c) => c === '1');
}

function toUrl(pixels) {
    // Take a series of pixels and convert it to a string format.

    const pixelStrings = [];

    const conv = (pixels) => pixels.map((p) => p ? '1' : '0').join('');

    // "conv" will give us a "binary" string representation. We want to
    // compress that by converting to base 32. But to convert to base 32, we'll
    // need to split things up to keep parseInt from overflowing.
    for (let i = 0; i < pixels.length; i += 32) {
        const upper = Math.min(i + 32, pixels.length);
        const current = conv(pixels.slice(i, upper));
        pixelStrings.push(parseInt(current, 2).toString(32));
    }

    return pixelStrings.join('-');
}


export { bindMethods, fromUrl, toUrl, pixelsToCanvas, scaleCanvas };
