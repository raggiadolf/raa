import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import App from './Components/App';
import './Styles/index.css';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-93092203-1');

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

ReactDOM.render(
  <Router history={ hashHistory } onUpdate={ logPageView }>
    <Route path="*" component={ App } />
  </Router>,
  document.getElementById('root')
);
