import { withRouter } from "react-router-dom";
import firebase from "firebase";
import React, { Component } from "react";
import { Card, CardActions, CardHeader } from "material-ui/Card";
import axios from "axios";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";

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
        return axios({
          url: "/createQuestionSet",
          method: "post",
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
      .then(res => {
        this.setState({ questionSets: res.data });
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
