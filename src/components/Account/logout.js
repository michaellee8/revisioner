import { withRouter } from 'react-router-dom'
import firebase from 'firebase'
import React, { Component } from 'react'
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton'

class LogoutInternal extends Component {
  render() {
    var user = firebase.auth().currentUser ? firebase.auth().currentUser : null;
    return (
      <div>
        <Card>
          <CardHeader
            title={ user.displayName }
            subtitle={ user.email }
            avatar={ user.photoURL } />
          <CardActions>
            <FlatButton
              label="LOGOUT"
              onTouchTap={ () => {
                             firebase.auth().signOut().then(() => {
                               this.props.onLogChange();
                               alert("Logout Success: Redirecting");
                               this.props.history.push('/');
                             }).catch(function(error) {
                               alert("Logout Fail: " + error);
                             });
                           } } />
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default withRouter(LogoutInternal);