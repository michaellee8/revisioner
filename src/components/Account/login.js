import { withRouter } from 'react-router-dom'
import firebase from 'firebase'
import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List'
import { Card, CardTitle, CardText } from 'material-ui/Card'

class LoginInternal extends Component {
  render() {
    return (
      <div>
        <Card>
          <CardTitle
            title="Login"
            subtitle="Please choose login method" />
          <CardText>
            <List>
              <ListItem
                primaryText="Sign in with FACEBOOK"
                onTouchTap={ () => {
                               firebase.auth().signInWithRedirect(new firebase.auth.FacebookAuthProvider()).then((result) => {
                                 this.props.onLogChange();
                                 alert("Login to Facebook Success: Redirecting");
                                 this.props.history.push('/');
                               }).catch(function(error) {
                                 alert("Login to Facebook Fail: " + error);
                               })
                             } } />
              <ListItem
                primaryText="Sign in with GOOGLE"
                onTouchTap={ () => {
                               firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider()).then((result) => {
                                 this.props.onLogChange();
                                 alert("Login to Google Success: Redirecting");
                                 this.props.history.push('/');
                               }).catch(function(error) {
                                 alert("Login to Google Fail: " + error);
                               })
                             } } />
            </List>
          </CardText>
        </Card>
      </div>
    )
  }
}

export default withRouter(LoginInternal);