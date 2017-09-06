import React, { Component } from "react";
import { Route } from "react-router-dom";
import About from "./About/about";
import Practice from "./Practice/practice";
import Account from "./Account/account";
import Create from "./Create/create";
import { Switch } from "react-router-dom";
import firebase from "firebase";
class GARoutes extends Component {
  logPageView() {
    window.ga("send", "pageview", window.location.pathname);
  }
  componentWillMount() {
    this.logPageView();
  }
  componentWillUpdate() {
    this.logPageView();
  }

  componentDidMount() {
    this.firebaseAuthChecker = firebase.auth().onAuthStateChanged(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    if (this.firebaseAuthChecker) {
      this.firebaseAuthChecker();
    }
  }
  render() {
    return (
      <Switch>
        <Route path="/about" component={About} />
        <Route path="/practice" component={Practice} />
        <Route path="/account" component={Account} />
        {firebase.auth().currentUser
          ? <Route path="/create" component={Create} />
          : null}
        <Route component={Practice} />
      </Switch>
    );
  }
}

export default GARoutes;
