import React from 'react';

class PixelEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {pixelData: [], switchState: null};

        for (let i = 0; i < 64; i++) {
            this.state.pixelData.push({id: i, on: false});
        }

        document.onmouseup = (e) => {
            e.preventDefault();
            this.setState({switchState: null});
        };
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

        return canvas;
    }

    mouseDown(e, p) {
        e.preventDefault();
        p.on = !p.on;
        this.setState({pixelData: this.state.pixelData, switchState: p.on});
    }

    mouseOver(e, p) {
        e.preventDefault();
        if (this.state.switchState !== null) {
            p.on = this.state.switchState;
            this.setState({pixelData: this.state.pixelData});
        }
    }

    render() {
        return <div className="controls">
                   <Grid pixelData={this.state.pixelData}
                       mouseDown={this.mouseDown.bind(this)}
                       mouseOver={this.mouseOver.bind(this)}>
                   </Grid>
                   <Mockup
                       canvasWidth="56"
                       canvasHeight="34"
                       image={this.getImage()}
                       mouseDown={this.setBackground.bind(this)}>
                   </Mockup>
               </div>
    }

    setBackground() {
        document.body.style.backgroundImage = `url("${this.getImage().toDataURL()}")`;
    }
}

class Grid extends React.Component {
    render() {
        let pixelData = this.props.pixelData.map((p) =>
                <Pixel
                    key={p.id}
                    on={p.on}
                    onMouseDown={(e) => this.props.mouseDown(e, p)}
                    onMouseOver={(e) => this.props.mouseOver(e, p)}>
                </Pixel>)

        return <div className="container">
                    <div className="grid">{pixelData}</div>
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
        const xCount = canvas.width / this.props.image.width + 1;
        const yCount = canvas.height / this.props.image.height + 1;
        const ctx = canvas.getContext('2d');

        for (let x = 0; x < xCount; x++) {
            for (let y = 0; y < yCount; y++) {
                ctx.drawImage(this.props.image, this.props.image.width * x - 7, this.props.image.height * y - 4);
            }
        }
    }

    render() {
        return <canvas
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
