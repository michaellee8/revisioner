import { withRouter } from "react-router-dom";
import firebase from "firebase";
import React, { Component } from "react";
import { List, ListItem } from "material-ui/List";
import { Card, CardTitle, CardText } from "material-ui/Card";
import axios from "axios";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";

class LoginInternal extends Component {
  state: {
    questionSets: Array<any>,
    newSetTitle: string,
    newSetSubtitle: string
  };
  createQuestionSet(title: string, subtitle: string) {
    firebase
      .auth()
      .currentUser.getToken(true)
      .catch(err => {
        console.log(err);
        this.getQuestionSet();
      })
      .then(authToken => {
        return axios({
          url: "/createQuestionSet",
          method: "get",
          baseURL: window.serverUrl,
          data: {
            authId: firebase.auth().currentUser.uid,
            authToken: authToken,
            title: title,
            subtitle: subtitle
          }
        });
      })
      .catch(err => {
        console.log(err);
        alert("Cannot create new question set");
      })
      .then(res => this.getQuestionSet());
  }
  getQuestionSet() {
    firebase
      .auth()
      .currentUser.getToken(true)
      .catch(err => {
        console.log(err);
        this.getQuestionSet();
      })
      .then(authToken => {
        return axios({
          url: "/getQuestionSet",
          method: "get",
          baseURL: window.serverUrl,
          params: {
            authId: firebase.auth().currentUser.uid,
            authToken: authToken
          }
        });
      })
      .catch(err => {
        console.log(err);
        this.getQuestionSet();
      })
      .then(res => {
        this.setState({ questionSets: res.data });
      });
  }
  render() {
    return (
      <div>
        <Card>
          <CardTitle
            title="Login"
            subtitle="YOU MUST NOT ATTEMPT TO SIGN IN WITH ACCOUNT REGISTERED BY SAME EMAIL ADDRESS"
          />
          <CardText>
            <List>
              <ListItem
                primaryText="Sign in with FACEBOOK"
                onTouchTap={() => {
                  firebase
                    .auth()
                    .signInWithRedirect(
                      new firebase.auth.FacebookAuthProvider().addScope("email")
                    )
                    .catch(function(error) {
                      alert("Login to Facebook Fail: " + error);
                    });
                  firebase
                    .auth()
                    .getRedirectResult()
                    .then(result => {
                      this.props.onLogChange();
                      this.props.history.push("/");
                      alert("Login to Facebook: Redirecting");
                    })
                    .catch(function(error) {
                      alert("Login to Facebook Fail: " + error);
                    });
                }}
              />
              <ListItem
                primaryText="Sign in with GOOGLE"
                onTouchTap={() => {
                  firebase
                    .auth()
                    .signInWithRedirect(new firebase.auth.GoogleAuthProvider())
                    .catch(function(error) {
                      alert("Login to Google Fail: " + error);
                    });
                  firebase
                    .auth()
                    .getRedirectResult()
                    .then(result => {
                      this.props.onLogChange();
                      this.props.history.push("/");
                      alert("Login to Google: Redirecting");
                    })
                    .catch(function(error) {
                      alert("Login to Google Fail: " + error);
                    });
                }}
              />
            </List>
          </CardText>
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

export default withRouter(LoginInternal);
