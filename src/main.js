import React from 'react';
import ReactDOM from 'react-dom';
import PixelEditor from './PixelEditor';

require('!style!css!less!../www/main.less');
 
document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    React.createElement(PixelEditor),
    document.getElementById('mount')
  );
});
