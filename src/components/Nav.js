import React, { Component } from "react";
import Drawer from "material-ui/Drawer";
import Paper from "material-ui/Paper";
import MenuItem from "material-ui/MenuItem";
import AppBar from "material-ui/AppBar";
import { Link } from "react-router-dom";
import GARoutes from "./GARoutes";
import AccountButton from "./Account/account-button";
import firebase from "firebase";
import { withRouter } from "react-router-dom";
import Avatar from "material-ui/Avatar";
import PracticeIcon from "material-ui/svg-icons/action/book";
import CreateIcon from "material-ui/svg-icons/image/edit";
import FollowedIcon from "material-ui/svg-icons/action/chrome-reader-mode";
import StatsIcon from "material-ui/svg-icons/editor/insert-chart";
import AboutIcon from "material-ui/svg-icons/action/info";
import {
  BottomNavigation,
  BottomNavigationItem
} from "material-ui/BottomNavigation";

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      index: 0
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
          title={this.props.location.pathname.substr(1) + "@Revisioner"}
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
            <MenuItem onTouchTap={this.handleClose} leftIcon={<PracticeIcon />}>
              Practice
            </MenuItem>
          </Link>
          {firebase.auth().currentUser ? (
            <Link
              to="/create"
              style={{
                textDecoration: "none"
              }}
            >
              <MenuItem onTouchTap={this.handleClose} leftIcon={<CreateIcon />}>
                Create
              </MenuItem>
            </Link>
          ) : null}
          {firebase.auth().currentUser ? (
            <Link
              to="/followed"
              style={{
                textDecoration: "none"
              }}
            >
              <MenuItem
                onTouchTap={this.handleClose}
                leftIcon={<FollowedIcon />}
              >
                Followed
              </MenuItem>
            </Link>
          ) : null}
          {firebase.auth().currentUser ? (
            <Link
              to="/stats"
              style={{
                textDecoration: "none"
              }}
            >
              <MenuItem onTouchTap={this.handleClose} leftIcon={<StatsIcon />}>
                Stats
              </MenuItem>
            </Link>
          ) : null}
          <Link
            to="/about"
            style={{
              textDecoration: "none"
            }}
          >
            <MenuItem onTouchTap={this.handleClose} leftIcon={<AboutIcon />}>
              About
            </MenuItem>
          </Link>
        </Drawer>
        <GARoutes />
        <div>
          <Paper zDepth={1} style={{ position: "fixed", bottom: 0 }}>
            <BottomNavigation selectedIndex={this.state.index}>
              <BottomNavigationItem
                onTouchTap={() =>
                  this.setState({ index: 0 }, () => {
                    this.props.history.push("/practice");
                  })}
                icon={<PracticeIcon />}
                label="Practice"
              />

              {firebase.auth().currentUser ? (
                <BottomNavigationItem
                  onTouchTap={() =>
                    this.setState({ index: 1 }, () => {
                      this.props.history.push("/create");
                    })}
                  icon={<CreateIcon />}
                  label="Create"
                />
              ) : (
                <BottomNavigationItem
                  onTouchTap={() =>
                    this.setState({ index: 1 }, () => {
                      this.props.history.push("/create");
                    })}
                  icon={<CreateIcon />}
                  label="Create"
                />
              )}
              {firebase.auth().currentUser ? (
                <BottomNavigationItem
                  onTouchTap={() =>
                    this.setState({ index: 2 }, () => {
                      this.props.history.push("/followed");
                    })}
                  icon={<FollowedIcon />}
                  label="Followed"
                />
              ) : (
                <BottomNavigationItem
                  onTouchTap={() =>
                    this.setState({ index: 2 }, () => {
                      this.props.history.push("/followed");
                    })}
                  icon={<FollowedIcon />}
                  label="Followed"
                />
              )}
              {firebase.auth().currentUser ? (
                <BottomNavigationItem
                  onTouchTap={() =>
                    this.setState({ index: 3 }, () => {
                      this.props.history.push("/stats");
                    })}
                  icon={<StatsIcon />}
                  label="Stats"
                />
              ) : (
                <BottomNavigationItem
                  onTouchTap={() =>
                    this.setState({ index: 3 }, () => {
                      this.props.history.push("/stats");
                    })}
                  icon={<StatsIcon />}
                  label="Stats"
                />
              )}

              <BottomNavigationItem
                onTouchTap={() =>
                  this.setState({ index: 4 }, () => {
                    this.props.history.push("/about");
                  })}
                icon={<AboutIcon />}
                label="About"
              />
            </BottomNavigation>
          </Paper>
        </div>
      </div>
    );
  }
}

export default withRouter(Nav);
