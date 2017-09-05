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
          "http://localhost:8080/graphql",
          `
          query getUserId {
            users {
              userId
            }
          }
        `
        );
      })
      .then(data =>
        request(
          "http://localhost:8080/graphql",
          `
        mutation newQuestionSet($input: createQuestionSetsInput!) {
          createQuestionSets(input: $input){
            clientMutationId
          }
        }
      `,
          {
            input: {
              values: [
                {
                  questionSetId: "",
                  userId: 1,
                  questionSetTitle: title,
                  questionSetIntro: subtitle,
                  questionSetCreateTimestamp: "",
                  questionSetLastUpdateTimestamp: ""
                }
              ]
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
          "http://localhost:8080/graphql",
          `
          query getUserId {
  users(where: {}) {
    userId
    questionSets {
      edges {
        node {
          questionSetId
          questionSetTitle
        }
      }
    }
  }
}

        `,
          {
            baseId: firebase.auth().currentUser.uid
          }
        );
      })
      .then(data => {
        console.log(data);
        this.setState({
          questionSets: data.users[0].questionSets.edges.map(edge => ({
            title: edge.node.questionSetTitle,
            id: edge.node.questionSetId
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
                  value={v.id}
                  checked={v.checked ? true : false}
                />
              );
            })}
          </Menu>
          <TextField
            hintText="New Question Set Title"
            onChange={(e, v) => this.setState({ newSetTitle: v })}
          />
          <TextField
            hintText="New Question Set Subtitle"
            onChange={(e, v) => this.setState({ newSetSubtitle: v })}
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
