import React from 'react';
 
/**
 * The basic canvas object.
 */
class Canvas extends React.Component {
  constructor() {
    super();

    this.isDrawing = false;
    this.extendLine = this.extendLine.bind(this);
    this.startDrawing = this.startDrawing.bind(this);
    this.stopDrawing = this.stopDrawing.bind(this);

    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
      console.log('component remounted');
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.strokeStyle='black';
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(this.canvas.width, this.canvas.height);
      this.ctx.stroke();
  }

  extendLine(e) {
      if (!this.isDrawing) return;
      this.ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);  // Consider alternatives to offsetX/offsetY
  }
 
  render() {
    return (
      <canvas 
        width="300px" 
        height="300px" 
        ref={(c) => {this.canvas = c; this.ctx = c.getContext('2d')}}
        onMouseDown={this.startDrawing}
        onMouseMove={this.extendLine}
        onMouseUp={this.stopDrawing}
      >
      </canvas>
    );
  }

  startDrawing(e) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 1;
      this.ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      this.isDrawing = true;
  }

  stopDrawing(e) {
      this.ctx = this.canvas.getContext('2d');
      this.ctx.stroke();
      this.isDrawing = false;
  }
}
export default Canvas;

