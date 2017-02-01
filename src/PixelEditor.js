import React from 'react';
import { fromUrl, toUrl, pixelsToCanvas, scaleCanvas } from './utilities';
import config from './config';
import compressedPatterns from './patterns';


const patterns = compressedPatterns.map(fromUrl);

function makeCanvas(w, h, pixels) {
    return scaleCanvas(pixelsToCanvas(w, h, pixels),
            config.xScale,
            config.yScale);
}

function strToBool(str) {
    return Array.prototype.map.call(str, (c) => c === "1");
}

const leftArrow = makeCanvas(3, 5, strToBool('110100000100110')).toDataURL();
const rightArrow = makeCanvas(3, 5, strToBool('011001000001011')).toDataURL();


class PixelEditor extends React.Component {
    constructor(props) {
        super(props);

        this.currentPattern = 0;

        this.state = {
            pixelData: fromUrl(document.location.search.slice(1) ||
                    compressedPatterns[this.currentPattern])
        };

        this.setBackground();
    }

    getImage() {
        return makeCanvas(8, 8, this.state.pixelData);
    }

    nextPattern() {
        this.currentPattern += 1;
        if (this.currentPattern >= patterns.length) {
            this.currentPattern = 0;
        }

        this.setPixels(patterns[this.currentPattern]);
    }

    previousPattern() {
        this.currentPattern -= 1;
        if (this.currentPattern < 0) {
            this.currentPattern = patterns.length - 1;
        }

        this.setPixels(patterns[this.currentPattern]);
    }

    render() {
        return <div id="pixelEditor">
                   <Grid pixelData={this.state.pixelData}
                       xPixels={8}
                       setPixels={this.setPixels.bind(this)}>
                   </Grid>
                   <div id="mockupContainer">
                       <img src={leftArrow} id="leftArrow" onClick={this.previousPattern.bind(this)}></img>
                       <img src={rightArrow} id="rightArrow" onClick={this.nextPattern.bind(this)}></img>
                       <Mockup
                           canvasWidth={ 54 * config.xScale }
                           canvasHeight={ 33 * config.yScale }
                           xOffset={ config.xOffset * config.xScale }
                           yOffset={ config.yOffset * config.xScale }
                           image={this.getImage()}
                           mouseDown={this.setBackground.bind(this)}>
                       </Mockup>
                   </div>
                   <a href={'?' + toUrl(this.state.pixelData)}>Link to pattern</a>
                   <a href={'?'}>Clear pattern</a>
               </div>;
    }

    setBackground() {
        document.body.style.backgroundImage = `url("${this.getImage().toDataURL()}")`;
    }

    setPixels(data) {
        this.setState({pixelData: data});
    }
}


class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.switchState = null;

        document.onmouseup = (e) => {
            this.switchState = null;
            e.preventDefault();
        };

    }

    mouseDown(e, id) {
        e.preventDefault();
        this.switchState = !this.props.pixelData[id];
        this.updatePixel(id);
    }

    mouseOver(e, id) {
        e.preventDefault();
        if (this.switchState !== null) {
            this.updatePixel(id);
        }
    }

    render() {
        const divs = [];
        const pixels = this.props.pixelData.map((isOn, id) => {
            return { isOn, id };
        });

        while (pixels.length > 0) {
            divs.push(pixels.splice(0, 8));
        }

        let data = divs.map((d, id) => {
            const rowPixels = d.map((p, id) =>
                <Pixel
                    key={p.id}
                    on={p.isOn}
                    onMouseDown={(e) => this.mouseDown(e, p.id)}
                    onMouseOver={(e) => this.mouseOver(e, p.id)}>
                </Pixel>
            );

            return <div key={id} className="pixelRow">{rowPixels}</div>;
        });

        return <div id="gridContainer">
                    <div id="grid">
                        {data}
                    </div>
               </div>;
    }

    updatePixel(id) {
        const pixels = this.props.pixelData.slice();
        pixels[id] = this.switchState;
        this.props.setPixels(pixels);
    }
}


class Mockup extends React.Component {
    constructor(props) {
        super(props);
        this.draw = this.draw.bind(this);
    }

    componentDidMount() {
        this.draw(this.canvas);
    }

    componentDidUpdate() {
        this.draw(this.canvas);
    }

    draw(canvas) {
        const xOffset = this.props.xOffset;
        const yOffset = this.props.yOffset;

        const tileWidth = this.props.image.width;
        const tileHeight = this.props.image.height;

        const xCount = (canvas.width - xOffset) / tileWidth + 1;
        const yCount = (canvas.height - yOffset) / tileHeight + 1;

        const ctx = canvas.getContext('2d');

        for (let x = 0; x < xCount; x++) {
            for (let y = 0; y < yCount; y++) {
                ctx.drawImage(this.props.image, tileWidth * x + xOffset, tileHeight * y + yOffset);
            }
        }
    }

    render() {
        return <canvas
            id="mockup"
            onMouseDown={this.props.mouseDown}
            ref={(c) => this.canvas = c}
            height={this.props.canvasHeight}
            width={this.props.canvasWidth}>
            </canvas>
    }
}


class Pixel extends React.Component {
    render() {
        return <div
            className={this.props.on ? "onPixel" : "offPixel"}
            onMouseDown={this.props.onMouseDown}
            onMouseOver={this.props.onMouseOver}></div>;
    }
}


export default PixelEditor;
