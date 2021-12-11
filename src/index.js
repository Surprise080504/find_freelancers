import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter as Router, Redirect, Route, Link} from 'react-router-dom';

ReactDOM.render(
<Router>
	<Route path = "/:country/:online" component = {App} />
</Router>
, document.getElementById('root'));
