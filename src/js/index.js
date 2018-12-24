import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
//import './mainpage.css';
import {Grid} from './grid.js';
import {Board} from './Board';


ReactDOM.render(<Grid />, document.getElementById('app'));

module.hot.accept();
