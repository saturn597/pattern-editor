import React from 'react';
import ReactDOM from 'react-dom';
import Canvas from './Canvas';
 
document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    React.createElement(Canvas),
    document.getElementById('mount')
  );
});
