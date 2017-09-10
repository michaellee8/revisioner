import React, { Component } from "react";
import axios from "axios";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import firebase from "firebase";
import Editor from "./editor";
import { request } from "graphql-request";
import DropDownMenu from "material-ui/DropDownMenu";

export default class Create extends Component {
  state: {
    questionSets: Array<any>,
    selectedQuestionSetValue: string
  };
  constructor(props) {
    super(props);
    this.state = { questionSets: [], selectedQuestionSetValue: "" };
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
            id: edge.node.questionSetId
          }))
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  componentWillMount() {
    this.getQuestionSet();
  }
  render() {
    return (
      <div>
        {"Select the question set"}
        <DropDownMenu
          value={this.state.selectedQuestionSetValue}
          onChange={(event: object, key: number, value: any) =>
            this.setState({ selectedQuestionSetValue: value })}
        >
          {this.state.questionSets.map(e => {
            console.log(e);
            return <MenuItem value={e.id} primaryText={e.title} key={e.id} />;
          })}
        </DropDownMenu>
        {this.state.selectedQuestionSetValue
          ? <Editor qSetId={this.state.selectedQuestionSetValue} />
          : null}
      </div>
    );
  }
}
