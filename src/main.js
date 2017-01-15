import React from 'react';
import ReactDOM from 'react-dom';
import PixelEditor from './PixelEditor';
 
document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    React.createElement(PixelEditor),
    document.getElementById('mount')
  );
});
