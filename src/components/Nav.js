import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import { Link } from 'react-router-dom'
import { Switch } from 'react-router-dom'
import { Route } from 'react-router-dom'
import About from './About/about'
import Practice from './Practice/practice'
import Account from './account'
import AccountButton from './account-button'

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  handleToggle = () => this.setState({
    open: !this.state.open
  });

  handleClose = () => this.setState({
    open: false
  });
  render() {
    return (
      <div>
        <AppBar
          title="Revisioner"
          onLeftIconButtonTouchTap={ this.handleToggle }
          iconElementRight={ <AccountButton/> } />
        <Drawer
          docked={ false }
          open={ this.state.open }
          onRequestChange={ (open) => this.setState({
                              open
                            }) }>
          <Link
            to="/practice"
            style={ {
                      textDecoration: 'none'
                    } }>
            <MenuItem onTouchTap={ this.handleClose }>
              Practice
            </MenuItem>
          </Link>
          <Link
            to="/about"
            style={ {
                      textDecoration: 'none'
                    } }>
            <MenuItem onTouchTap={ this.handleClose }>
              About
            </MenuItem>
          </Link>
        </Drawer>
        <Switch>
          <Route
            path="/about"
            component={ About } />
          <Route
            path="/practice"
            component={ Practice } />
          <Route
            path="/account"
            component={ Account } />
          <Route component={ Practice } />
        </Switch>
      </div>
      );
  }
}

export default Nav;