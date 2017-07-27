import React, { Component } from 'react'
import firebase from 'firebase'
import { withRouter } from 'react-router-dom'
import LogonIcon from 'material-ui/svg-icons/action/account-circle'
import LogoffIcon from 'material-ui/svg-icons/action/account-box'
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';

class AccountButtonInternal extends Component {
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
    const {history} = this.props;

    if (firebase.auth().currentUser) {
      if (firebase.auth().currentUser.photoURL) {
        return (<IconButton onTouchTap={ () => (history.push('/account')) }>
                  <Avatar src={ firebase.auth().currentUser.photoURL }></Avatar>
                </IconButton>);
      } else {
        return (<IconButton onTouchTap={ () => (history.push('/account')) }>
                  <LogonIcon/>
                </IconButton>);
      }
    } else {
      return (<IconButton onTouchTap={ () => (history.push('/account')) }>
                <LogoffIcon/>
              </IconButton>);
    }
  }
}

export default withRouter(AccountButtonInternal);