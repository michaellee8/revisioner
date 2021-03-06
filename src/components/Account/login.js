import { withRouter } from "react-router-dom";
import firebase from "firebase";
import React, { Component } from "react";
import { List, ListItem } from "material-ui/List";
import { Card, CardTitle, CardText } from "material-ui/Card";

class LoginInternal extends Component {
  render() {
    return (
      <div>
        <Card>
          <CardTitle
            title="Login"
            subtitle="YOU MUST NOT ATTEMPT TO SIGN IN WITH ACCOUNT REGISTERED BY SAME EMAIL ADDRESS"
          />
          <CardText>
            <List>
              <ListItem
                primaryText="Sign in with FACEBOOK"
                onTouchTap={() => {
                  firebase
                  .auth()
                  .signInWithRedirect(
                    new firebase.auth.FacebookAuthProvider().addScope("email")
                  )
                  .catch(function(error) {
                    alert("Login to Facebook Fail: " + error);
                  });
                  firebase
                  .auth()
                  .getRedirectResult()
                  .then(result => {
                    this.props.onLogChange();
                    this.props.history.push("/");
                    alert("Login to Facebook: Redirecting");
                  })
                  .catch(function(error) {
                    alert("Login to Facebook Fail: " + error);
                  });
                }}
              />
              <ListItem
                primaryText="Sign in with GOOGLE"
                onTouchTap={() => {
                  firebase
                  .auth()
                  .signInWithRedirect(new firebase.auth.GoogleAuthProvider())
                  .catch(function(error) {
                      alert("Login to Google Fail: " + error);
                    });
                  firebase
                    .auth()
                    .getRedirectResult()
                    .then(result => {
                      this.props.onLogChange();
                      this.props.history.push("/");
                      alert("Login to Google: Redirecting");
                    })
                    .catch(function(error) {
                      alert("Login to Google Fail: " + error);
                    });
                }}
              />
            </List>
          </CardText>
        </Card>
      </div>
    );
  }
}

export default withRouter(LoginInternal);
