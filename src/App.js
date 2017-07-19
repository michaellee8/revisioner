import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <Router>
        <Header/>
        <Main/>
      </Router>
    );
  }
}

export default App;
