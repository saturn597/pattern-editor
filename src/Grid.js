import React from 'react';

class Grid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {pixels: []};

        for (let i = 0; i < 3; i++) {
            this.state.pixels.push({id: i, on: false});
        }
    }

    render() {
        let pixels = this.state.pixels.map((p) => 
                <Pixel 
                    key={p.id}
                    on={p.on}
                    onClick={this.setPixel.bind(this, p, !p.on)}>
                </Pixel>)

        return <div className="grid">{pixels}</div>;
    }

    setPixel(p, on) {
        console.log('clicked ' + p.id);
        p.on = on;
        this.setState({pixels: this.state.pixels});
    }
}

class Pixel extends React.Component {
    render() {
        console.log(this.props);
        return <div 
            className={this.props.on ? "onPixel" : "offPixel"}
            onClick={this.props.onClick}></div>;
    }
}

export default Grid;
