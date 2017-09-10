import React, { Component } from "react";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";
import AppBar from "material-ui/AppBar";
import { Link } from "react-router-dom";
import GARoutes from "./GARoutes";
import AccountButton from "./Account/account-button";
import firebase from "firebase";

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  handleToggle = () =>
    this.setState({
      open: !this.state.open
    });

  handleClose = () =>
    this.setState({
      open: false
    });
  render() {
    return (
      <div>
        <AppBar
          title="Revisioner"
          onLeftIconButtonTouchTap={this.handleToggle}
          iconElementRight={<AccountButton />}
        />
        <span>
          {
            "Tip: you may need to manually refresh by pulling down the page or press F5 to see the changes"
          }
          <br />
          {
            "Tip x2: Please login to use all features by clicking icon at top-right corner"
          }
        </span>
        <Drawer
          docked={false}
          open={this.state.open}
          onRequestChange={open =>
            this.setState({
              open
            })}
        >
          <Link
            to="/practice"
            style={{
              textDecoration: "none"
            }}
          >
            <MenuItem onTouchTap={this.handleClose}>Practice</MenuItem>
          </Link>
          {firebase.auth().currentUser
            ? <Link
                to="/create"
                style={{
                  textDecoration: "none"
                }}
              >
                <MenuItem onTouchTap={this.handleClose}>Create</MenuItem>
              </Link>
            : null}

          <Link
            to="/about"
            style={{
              textDecoration: "none"
            }}
          >
            <MenuItem onTouchTap={this.handleClose}>About</MenuItem>
          </Link>
        </Drawer>
        <GARoutes />
      </div>
    );
  }
}

export default Nav;
