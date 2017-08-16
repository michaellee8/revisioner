import React, { Component } from "react";
import QuestionList from "./question-list";
import axios from "axios";
import firebase from "firebase";

class Practice extends Component {
  state: {
    QuestionSet: Array<any>,
    fetchTimes: number
  };
  constructor(props) {
    super(props);
    this.setState({ fetchTimes: 0, QuestionSet: [] });
  }
  getQuestions() {
    if (firebase.currentUser) {
      firebase
        .auth()
        .currentUser.getToken(true)
        .catch(err => {
          console.log(err);
          this.getQuestions();
        })
        .then(authToken => {
          return axios({
            url: "/getQuestions/byUid",
            method: "get",
            baseURL: window.serverUrl,
            params: {
              authId: firebase.auth().currentUser.uid,
              authToken: authToken,
              fetchTimes: this.state.fetchTimes
            }
          });
        })
        .catch(err => {
          console.log(err);
          this.getQuestions();
        })
        .then(res => {
          this.setState((prevState, props) => ({
            QuestionSet: prevState.QuestionSet.concat(res.data),
            fetchTimes: prevState.fetchTimes + 1
          }));
        });
    }
  }
  componentWillMount() {
    this.setState({
      fetchTimes: 0,
      QuestionSet: []
    });
    this.getQuestions();
  }
  render() {
    return <QuestionList QuestionSet={this.state.QuestionSet} />;
  }
}

export default Practice;
