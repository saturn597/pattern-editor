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

export { scaleCanvas };
