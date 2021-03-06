import React from 'react';
import { bindMethods, fromUrl, toUrl, pixelsToCanvas, scaleCanvas } from './utilities';
import config from './config';
import compressedPatterns from './patterns';
import Life from './Life';


const patterns = compressedPatterns.map((p) => fromUrl(p, 64));

function makeCanvas(w, h, pixels) {
    return scaleCanvas(pixelsToCanvas(w, h, pixels),
            config.xScale,
            config.yScale);
}

const leftArrow = makeCanvas(3, 5, fromUrl('q16', 15)).toDataURL();
const rightArrow = makeCanvas(3, 5, fromUrl('cgb', 15)).toDataURL();


class PixelEditor extends React.Component {
    constructor(props) {
        super(props);

        this.currentPattern = 4;

        this.state = {
            pixelData: fromUrl(document.location.search.slice(1) ||
                    compressedPatterns[this.currentPattern], 64)
        };

        this.setBackground();

        bindMethods(this, [
            'checkKeys',
            'nextPattern',
            'previousPattern',
            'setBackground',
            'setPixels',
            'stepLife',
        ]);
    }

    checkKeys(e) {
        if (e.key === 'l' || e.key === 'L') {
            this.stepLife();
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.checkKeys);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.checkKeys);
    }

    getScaledTile() {
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

    stepLife() {
        // Our Life class considers "true" cells alive. It looks better if our
        // "false" pixels (the black ones) are the ones that are alive. So we
        // "invert" the values when passing to and from the Life instance.
        const r = a => a.map(v => !v);
        this.setState((state, props) => {
            const life = new Life(8, 8, r(state.pixelData));
            return { pixelData: r(life.nextState()) };
        });
    }

    render() {
        const tileExamples = [1, 2, 3, 4, 5].map((scale, k) => {
            const c = scaleCanvas(pixelsToCanvas(8, 8, this.state.pixelData), scale, scale);
            return <img src={c.toDataURL()} className="tileExample" key={k} />;
        });

        return <div id="pixelEditor">
                   <Grid pixelData={this.state.pixelData}
                       xPixels={8}
                       setPixels={this.setPixels} />
                   <div id="mockupContainer">
                       <img src={leftArrow}
                            id="leftArrow"
                            onClick={this.previousPattern} />
                       <img src={rightArrow}
                            id="rightArrow"
                            onClick={this.nextPattern} />
                       <Mockup
                           canvasWidth={ 54 * config.xScale }
                           canvasHeight={ 33 * config.yScale }
                           xOffset={ config.xOffset * config.xScale }
                           yOffset={ config.yOffset * config.xScale }
                           tile={this.getScaledTile()}
                           mouseDown={this.setBackground} />
                   </div>
                   <div><a href={'?' + toUrl(this.state.pixelData)} id="patternLink">Link to pattern</a></div>
                   <div id="tileExamples">{tileExamples}</div>
                   <Description content={config.description} />
               </div>;
    }

    setBackground() {
        document.body.style.backgroundImage = `url("${this.getScaledTile().toDataURL()}")`;
    }

    setPixels(data) {
        this.setState({pixelData: data});
    }
}


class Description extends React.Component {
    constructor(props) {
        super(props);
        this.state = {show: false};
        this.show = () => this.setState({show: true});
        this.hide = () => this.setState({show: false});
    }

    render() {
        if (this.state.show) {
            return <div id="description">
                       <div><span id="descriptionControl" onClick={this.hide}>Hide Description</span></div>
                       {this.props.content}
                   </div>;
        }  else {
            return <div id="description">
                        <span id="descriptionControl" onClick={this.show}>What is this?</span>
                   </div>;
        }
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
                    onMouseOver={(e) => this.mouseOver(e, p.id)} />
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

        const tileWidth = this.props.tile.width;
        const tileHeight = this.props.tile.height;

        const xCount = (canvas.width - xOffset) / tileWidth + 1;
        const yCount = (canvas.height - yOffset) / tileHeight + 1;

        const ctx = canvas.getContext('2d');

        for (let x = 0; x < xCount; x++) {
            for (let y = 0; y < yCount; y++) {
                ctx.drawImage(this.props.tile, tileWidth * x + xOffset, tileHeight * y + yOffset);
            }
        }
    }

    render() {
        return <canvas
            id="mockup"
            onMouseDown={this.props.mouseDown}
            ref={(c) => this.canvas = c}
            height={this.props.canvasHeight}
            width={this.props.canvasWidth} />
    }
}


class Pixel extends React.Component {
    render() {
        return <div
            className={this.props.on ? "onPixel" : "offPixel"}
            onMouseDown={this.props.onMouseDown}
            onMouseOver={this.props.onMouseOver} />;
    }
}


export default PixelEditor;
