import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './NavImages.css'

const firebase = require("firebase");
require("firebase/firestore");
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

