import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import About from './About/about'
import Practice from './Practice/practice'
import Account from './Account/account'
import Create from './Create/create'
import { Switch } from 'react-router-dom'
class GARoutes extends Component {
  logPageView() {
    window.ga('send', 'pageview', window.location.pathname);
  }
  componentWillMount() {
    this.logPageView();
  }
  componentWillUpdate() {
    this.logPageView();
  }
  render() {
    return (<Switch>
              <Route
                path="/about"
                component={ About } />
              <Route
                path="/practice"
                component={ Practice } />
              <Route
                path="/account"
                component={ Account } />
              <Route
                path="/create"
                component={ Create } />
              <Route component={ Practice } />
            </Switch>
      );
  }
}

export default GARoutes;