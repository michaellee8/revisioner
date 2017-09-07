import { withRouter } from "react-router-dom";
import firebase from "firebase";
import React, { Component } from "react";
import { Card, CardActions, CardHeader } from "material-ui/Card";
import axios from "axios";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import { request } from "graphql-request";

class LogoutInternal extends Component {
  state: {
    questionSets: Array<any>,
    newSetTitle: string,
    newSetSubtitle: string
  };
  constructor(props) {
    super(props);
    this.state = { questionSets: [], newSetTitle: "", newSetSubtitle: "" };
  }
  componentWillMount() {
    this.getQuestionSet();
  }
  createQuestionSet(title: string, subtitle: string) {
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
              userId
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
      .then(data =>
        request(
          window.serverUrl,
          `
        mutation newQuestionSet($input: createQuestionSetsInput!) {
          createQuestionSets(input: $input){
            clientMutationId
          }
        }
      `,
          {
            input: {
              questionSetId: "",
              userId: data.users[0].userId,
              questionSetTitle: title,
              questionSetIntro: subtitle,
              questionSetCreateTimestamp: "",
              questionSetLastUpdateTimestamp: ""
            }
          }
        )
      )
      .then(res => this.getQuestionSet())
      .catch(err => {
        console.log(err);
        alert("Cannot create new question set");
      });
  }
  getQuestionSet() {
    firebase
      .auth()
      .currentUser.getToken(true)
      .catch(err => {
        console.log(err);
      })
      .then(authToken => {
        /*where: {userFirebaseAuthId: $baseId}
$baseId: String
        */
        return request(
          window.serverUrl,
          `
          query getUserQuestionSet($w:SequelizeJSON) {
            users(where:$w) {
              userId
              questionSets {
                edges {
                  node {
                    questionSetId
                    questionSetTitle
                    questionSetIntro
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
        this.setState({
          questionSets: data.users[0].questionSets.edges.map(edge => ({
            title: edge.node.questionSetTitle,
            id: edge.node.questionSetId,
            subtitle: edge.node.questionSetIntro
          }))
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    var user = firebase.auth().currentUser ? firebase.auth().currentUser : null;
    return (
      <div>
        <Card>
          <CardHeader
            title={user.displayName}
            subtitle={user.email}
            avatar={user.photoURL}
          />
          <CardActions>
            <FlatButton
              label="LOGOUT"
              onTouchTap={() => {
                firebase
                  .auth()
                  .signOut()
                  .then(() => {
                    this.props.onLogChange();
                    alert("Logout Success: Redirecting");
                    this.props.history.push("/");
                  })
                  .catch(function(error) {
                    alert("Logout Fail: " + error);
                  });
              }}
            />
          </CardActions>
        </Card>
        <div>QuestionSet you have created</div>
        <div>
          <Menu
            disableAutoFocus={true}
            onChange={(e, v) => {
              this.setState((prevState, props) => {
                var arr = JSON.parse(JSON.stringify(prevState.questionSets));
                var i;
                for (i = 0; i < arr.length; i++) {
                  if (arr[i].value === v) {
                    arr[i].checked = true;
                  } else {
                    arr[i].checked = false;
                  }
                }
                return {
                  questionSets: arr,
                  selectedQuestionSetValue: v
                };
              });
            }}
          >
            {this.state.questionSets.map(v => {
              return (
                <MenuItem
                  primaryText={v.title}
                  // secondaryText={v.subtitle}
                  value={v.id}
                  key={v.id}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Do you really want to delete question set " +
                          v.title +
                          " ?"
                      )
                    ) {
                      request(
                        window.serverUrl,
                        `
                        mutation removeqset($input:deleteQuestionSetsInput!){
                          deleteQuestionSets(input:$input){
                            affectedCount
                          }
                        }
                        `,
                        {
                          input: {
                            where: {
                              userId: "1.5",
                              questionSetId: v.id
                            }
                          }
                        }
                      );
                      this.getQuestionSet();
                    }
                  }}
                  checked={v.checked ? true : false}
                />
              );
            })}
          </Menu>
          <TextField
            hintText="New Question Set Title"
            value={this.state.newSetTitle}
            autoFocus={true}
            onChange={(e, v) => {
              this.setState({ newSetTitle: v });
            }}
          />
          <TextField
            hintText="New Question Set Intro"
            value={this.state.newSetSubtitle}
            autoFocus={true}
            onChange={(e, v) => {
              this.setState({ newSetSubtitle: v });
            }}
          />
          <FlatButton
            label="Add Question Set"
            onTouchTap={() =>
              this.createQuestionSet(
                this.state.newSetTitle,
                this.state.newSetSubtitle
              )}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(LogoutInternal);
