import React, { Component } from 'react'
import Logout from './logout'
import Login from './login'
import firebase from 'firebase'

class Account extends Component {
  constructor(props) {
    super(props);
    this.handleLogChange = this.handleLogChange.bind(this);
  }
  handleLogChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.firebaseAuthChecker = firebase.auth().onAuthStateChanged(() => {
      this.forceUpdate()
    });
  }

  componentWillUnmount() {
    if (this.firebaseAuthChecker) {
      this.firebaseAuthChecker();
    }
  }

  render() {
    return firebase.auth().currentUser ? (
      <Logout onLogChange={ this.handleLogChange } />) : (
      <Login onLogChange={ this.handleLogChange } />);
  }
}

export default Account;