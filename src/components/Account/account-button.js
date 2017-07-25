import React, { Component } from 'react'
import firebase from 'firebase'
import { withRouter } from 'react-router-dom'
import LogonIcon from 'material-ui/svg-icons/action/account-circle'
import LogoffIcon from 'material-ui/svg-icons/action/account-box'
import IconButton from 'material-ui/IconButton';

class AccountButtonInternal extends Component {
  render() {
    const {history} = this.props;

    return (<IconButton onTouchTap={ () => (history.push('/account')) }>
              { firebase.auth().currentUser ? (
                <LogonIcon/>) : (
                <LogoffIcon/>) }
            </IconButton>);
  }
}

export default withRouter(AccountButtonInternal);