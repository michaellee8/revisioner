const Component = require("Component");
const Menu = require("Menu.react");
const MenuItem = require("MenuItem.react");
const React = require("React");

const axios = require("axios");
const firebase = require("firebase");

import React, { Component } from "react";
import axios from "axios";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import firebase from "firebase";

class Create extends Component {
  state: {
    questionSets: Array<any>,
    selectedQuestionSetValue: string
  };
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
        Select the question set
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
        <Editor
          SetTitle={
            this.state.questionSets.find(
              element => element.value === this.state.selectedQuestionSetValue
            ).title
          }
          SetTitle={
            this.state.questionSets.find(
              element => element.value === this.state.selectedQuestionSetValue
            ).subtitle
          }
          SetId={
            this.state.questionSets.find(
              element => element.value === this.state.selectedQuestionSetValue
            ).id
          }
          sumbitHandler={data => {
            axios({
              url: "/createQuestion",
              method: "post",
              baseURL: window.serverUrl,
              data: data
            }).catch(err => {
              console.log(err);
              alert("Cannot Sumbit Question");
            });
          }}
        />
      </div>
    );
  }
}
