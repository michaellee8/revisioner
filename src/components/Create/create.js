import React, { Component } from 'react'
import axios from 'axios'
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

class Create extends Component {
  state: {
    questionSets: Array<any>
  }
  getQuestionSet(){
    firebase.auth().currentUser.getToken(true).catch(err => {
      console.log(err);
      this.getQuestions();
    }).then(authToken => {
      return axios({
        url: "/getQuestions/byUid",
        method: "get",
        baseURL: window.serverUrl,
        params: {
          authId: firebase.auth().currentUser.uid,
          authToken: authToken,
          fetchTimes: this.state.fetchTimes
        }
      })
    })
  }
  render() {
    return (
      <div>
        Select the question set
        <Menu onChange={ (e, v) => {
                           this.setState((prevState, props) => {
                             var arr = JSON.parse(JSON.stringify(prevState.questionSets));
                             var i;
                             for (i = 0; i < arr.length; i++) {
                               if (arr[i].value === v) {
                                 arr[i].checked = true
                               } else {
                                 arr[i].checked = false;
                               }
                             }
                             return {
                               questionSets: arr
                             };
                           })
                         } }>
          { this.state.questionSets.map((v) => {
              return (<MenuItem
                        primaryText={ v.title }
                        value={ v.id }
                        checked={ v.checked ? true : false } />)
            }) }
        </Menu>
      </div>);
  }
}
