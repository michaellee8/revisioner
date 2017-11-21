import React, { Component } from "react";
import QuestionList from "./question-list";
import axios from "axios";
import firebase from "firebase";
import { request } from "graphql-request";

export default class Quiz extends Component {
  state: {
    QuestionSet: Array<any>
  };
  constructor(props) {
    super(props);
    this.state = { QuestionSet: [] };
    this.getQuestions = this.getQuestions.bind(this);
    this.getQuestions();
  }
  componentDidMount() {
    this.firebaseAuthChecker = firebase.auth().onAuthStateChanged(() => {
      this.forceUpdate();
      this.getQuestions();
    });
  }

  componentWillUnmount() {
    if (this.firebaseAuthChecker) {
      this.firebaseAuthChecker();
    }
  }
  getQuestions() {
    request(
      window.serverUrl,
      `
      query qCount{
        questionsCount
      }
      `
    )
      .then(data =>
        Promise.all(
          genRanArray(data.questionsCount, 5).map(val =>
            request(
              window.serverUrl,
              `
    query getQuestion($offset: Int, $where: SequelizeJSON, $order: String, $limit: Int) {
      questions(offset: $offset, where: $where, order: $order, limit: $limit) {
        questionId
        questionSet {
          questionSetTitle
          questionSetIntro
          questionSetId
          user {
            userId
            userName
            userPhotoUrl
            userIntro
            userFirebaseAuthId
          }
        }
        questionTitle
        questionContent
        questionType
        questionLastUpdateTimestamp
        questionAnswers {
          edges {
            node {
              questionAnswerId
              questionAnswerText
              questionAnswerIsCorrect
              questionSumbits {
                total
              }
            }
          }
        }
        questionComments {
          total
          edges {
            node {
              questionCommentId
              questionCommentContent
              questionCommentLastUpdateTimestamp
              user {
                userName
                userPhotoUrl
              }
            }
          }
        }
        questionReactions {
          edges {
            node {
              questionReactionType
              user {
                userName
                userFirebaseAuthId
              }
            }
          }
          total
        }
      }
    }

    `,
              { order: "questionCreateTimestamp", limit: 1, offset: val }
            )
          )
        )
      )
      .then(arr =>
        this.setState({ QuestionSet: arr.map(e => e.questions[0]) })
      );
  }
  componentWillMount() {
    this.getQuestions();
  }
  render() {
    return (
      <QuestionList
        QuestionSet={this.state.QuestionSet}
        isFollow={false}
        fetchQ={(fn: Function) => {
          this.getQuestions();
          fn();
        }}
      />
    );
  }
}

function genRanArray(range, num) {
  var arr = [];
  for (var i = 0; i < num; i++) {
    var randNum;
    do {
      randNum = Math.floor(Math.random() * range);
    } while (arr.indexOf(randNum) > -1);
    arr.push(randNum);
  }
  return arr;
}
