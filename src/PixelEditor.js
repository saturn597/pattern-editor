import React from 'react';
import { fromUrl, toUrl, scaleCanvas } from './utilities';
import config from './config';

class PixelEditor extends React.Component {
    constructor(props) {
        super(props);

        // fromUrl('3vvvvvv3vvvvvv') yields an array of pixels that
        // are all "on" - make that the default.
        this.allOn = '3vvvvvv3vvvvvv';
        this.state = {
            pixelData: fromUrl(document.location.search.slice(1) ||
                    this.allOn)
        };

        this.setBackground();
    }

    getImage() {
        const canvas = document.createElement('canvas');
        canvas.height = 8;
        canvas.width = 8;

        const ctx = canvas.getContext('2d');
        const id = ctx.createImageData(8, 8);

        let i = 0;
        for (let p of this.state.pixelData) {
            if (p.on) {
                id.data.fill(255, i, i + 4);
            } else {
                id.data.fill(0, i, i + 3);
                id.data[i + 3] = 255;
            }
            i+=4;
        }

        ctx.putImageData(id, 0, 0);

        return scaleCanvas(canvas, config.xScale, config.yScale);
    }

    render() {
        return <div className="controls">
                   <Grid pixelData={this.state.pixelData}
                       xPixels={8}
                       updatePixels={this.updatePixels.bind(this)}>
                   </Grid>
                   <div className="mockupContainer">
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
                   <a href={'?' + this.allOn}>Clear pattern</a>
               </div>;
    }

    setBackground() {
        document.body.style.backgroundImage = `url("${this.getImage().toDataURL()}")`;
    }

    updatePixels(data) {
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

    mouseDown(e, p) {
        e.preventDefault();
        p.on = !p.on;
        this.switchState = p.on;
        this.props.updatePixels(this.props.pixelData);
    }

    mouseOver(e, p) {
        e.preventDefault();
        if (this.switchState !== null) {
            p.on = this.switchState;
            this.props.updatePixels(this.props.pixelData);
        }
    }

    render() {
        const divs = [];
        const pixels = this.props.pixelData.slice();

        while (pixels.length > 0) {
            divs.push(pixels.splice(0, 8));
        }

        let data = divs.map((d, id) => {
            const rowPixels = d.map((p) =>
                <Pixel
                    key={p.id}
                    on={p.on}
                    onMouseDown={(e) => this.mouseDown(e, p)}
                    onMouseOver={(e) => this.mouseOver(e, p)}>
                </Pixel>
            );

            return <div key={id} className="pixelRow">{rowPixels}</div>;
        });

        return <div className="gridContainer">
                    <div className="grid">
                        {data}
                    </div>
               </div>;
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
            className="mockup"
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
