import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Nav from './components/Nav'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactGA from 'react-ga';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Router onUpdate={ () => (ReactGA.pageview(window.location.pathname)) }>
          <Route
            path="/"
            component={ Nav }></Route>
        </Router>
      </MuiThemeProvider>
      );
  }
}

export default App;
