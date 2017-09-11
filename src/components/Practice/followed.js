import React, { Component } from "react";
import QuestionList from "./question-list";
import axios from "axios";
import firebase from "firebase";
import { request } from "graphql-request";

class Followed extends Component {
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
    firebase
      .auth()
      .currentUser.getToken(true)
      .catch(err => {
        console.log(err);
        this.getQuestionSet();
      })
      .then(authToken => {
        return request(
          window.serverUrl,
          `
          query getUserId($w:SequelizeJSON) {
            users (where:$w){
              questionSetFollows{
                edges{
                  node{
                    questionSetId
                  }
                }
              }
            }
          }
        `,
          {
            w: {
              userFirebaseAuthId: firebase.auth().currentUser.uid
            }
          }
        );
      })
      .then(data => {
        request(
          window.serverUrl,
          `
          query qCount($where: SequelizeJSON) {
            questionsCount(where: $where)
          }
          `,
          {
            where: {
              questionSetId: {
                $in: data.users[0].questionSetFollows.edges.map(
                  e => e.node.questionSetId
                )
              }
            }
          }
        )
          .then(d =>
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
                where: {
                  questionSetId: {
                    $in: data.users[0].questionSetFollows.edges.map(
                      e => e.node.questionSetId
                    )
                  }
                },
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
              QuestionSet: prevState.QuestionSet.concat(
                data.questions.reverse()
              ),
              fetchTimes: prevState.fetchTimes + 1
            }));
          })
          .catch(err => {
            console.log(err);
            window.alert("Internal error happened, please try again later");
          });
      });
    if (true) {
    }
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

export default Followed;
