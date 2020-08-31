import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';

/* eslint-disable */

console.log = console.warn = console.error = () => {};

ReactDOM.render(

    <div className="container-fluid">
      <App />
    </div>,
  document.getElementById('root')
);
