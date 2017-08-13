import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import { Link } from 'react-router-dom'
import GARoutes from './GARoutes'
import AccountButton from './Account/account-button'

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
            to="/create"
            style={ {
                      textDecoration: 'none'
                    } }>
            <MenuItem onTouchTap={ this.handleClose }>
              Create
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
        <GARoutes/>
      </div>
      );
  }
}

export default Nav;