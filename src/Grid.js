import React from 'react';

class Grid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {pixels: [], switchState: null};

        for (let i = 0; i < 64; i++) {
            this.state.pixels.push({id: i, on: false});
        }

        document.onmouseup = (e) => {
            e.preventDefault();
            this.setState({switchState: null});
        };
    }

    render() {
        let pixels = this.state.pixels.map((p) => 
                <Pixel 
                    key={p.id}
                    on={p.on}
                    onMouseDown={this.mouseDown.bind(this, p)}
                    onMouseOver={this.mouseOver.bind(this, p)}>
                </Pixel>)

        return <div className="container">
                    <div className="grid">{pixels}</div>
               </div>;
    }

    mouseDown(p, e) {
        e.preventDefault();
        p.on = !p.on;
        this.setState({pixels: this.state.pixels, switchState: p.on});
    }

    mouseOver(p, e) {
        e.preventDefault();
        if (this.state.switchState !== null) {
            p.on = this.state.switchState;
            this.setState({pixels: this.state.pixels});
        }
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

export default Grid;
