import React from 'react';
import ReactDOM from 'react-dom';
import {Grid} from './grid.js';
import {Board} from './Board';


ReactDOM.render(<Grid />, document.getElementById('app'));

module.hot.accept();
