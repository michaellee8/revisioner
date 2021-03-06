import React, { Component } from "react";
import QuestionList from "./question-list";
import axios from "axios";
import firebase from "firebase";
import { request } from "graphql-request";

class Practice extends Component {
  state: {
    QuestionSet: Array<any>,
    fetchTimes: number
  };
  constructor(props) {
    super(props);
    this.state = { fetchTimes: 0, QuestionSet: [] };
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
    if (true) {
      request(
        window.serverUrl,
        `
          {
            questionsCount
          }
        `
      )
        .then(data =>
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
            {
              where: {},
              order: "questionCreateTimestamp",
              limit: 5,
              offset:
                data.questionsCount - 5 * (this.state.fetchTimes + 1) > 0
                  ? data.questionsCount - 5 * (this.state.fetchTimes + 1)
                  : 0
            }
          )
        )
        .then(data => {
          console.log(data);
          this.setState((prevState, props) => ({
            QuestionSet: prevState.QuestionSet.concat(data.questions.reverse()),
            fetchTimes: prevState.fetchTimes + 1
          }));
        })
        .catch(err => {
          console.log(err);
          window.alert("Internal error happened, please try again later");
        });
    }
  }
  componentWillMount() {
    this.getQuestions();
  }
  render() {
    return (
      <QuestionList
        QuestionSet={this.state.QuestionSet}
        isFollow={true}
        fetchQ={(fn: Function) => {
          this.getQuestions();
          fn();
        }}
      />
    );
  }
}

export default Practice;
