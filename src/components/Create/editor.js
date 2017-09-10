import React, { Component } from "react";
import CorrectIcon from "material-ui/svg-icons/action/done";
import {
  Card,
  CardText,
  CardActions,
  CardTitle,
  CardHeader
} from "material-ui/Card";
import { List, ListItem } from "material-ui/List";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import WrongIcon from "material-ui/svg-icons/content/clear";
import firebase from "firebase";
import { request } from "graphql-request";
import Checkbox from "material-ui/Checkbox";

export default class Editor extends Component {
  props: {
    qSetId: string
  };
  state: {
    qSetTitle: string,
    qSetIntro: string,
    questionTitle: string,
    questionType: string,
    questionText: string,
    option: Array<{ text: string, isCorrect: boolean }>,
    currentOption: string,
    currentOptionIsCorrect: boolean
  };
  constructor(props) {
    super(props);
    this.state = {
      qSetTitle: "",
      qSetIntro: "",
      questionTitle: "",
      questionType: "",
      questionText: "",
      correctOption: 0,
      option: [],
      currentOption: "",
      currentOptionIsCorrect: false
    };
    this.getQSet(this.props.qSetId);
  }
  getQSet(qSetId: string) {
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
          query getQuestionSetInfo($where: SequelizeJSON) {
            questionSets(where: $where) {
              questionSetId
              userId
              questionSetTitle
              questionSetIntro
            }
          }
          `,
          {
            where: {
              questionSetId: parseInt(qSetId)
            }
          }
        );
      })
      .then(data =>
        this.setState({
          qSetTitle: data.questionSets[0]
            ? data.questionSets[0].questionSetTitle
            : null,
          qSetIntro: data.questionSets[0]
            ? data.questionSets[0].questionSetIntro
            : null
        })
      )
      .catch(err => {
        console.log(err);
      });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.qSetId !== this.props.qSetId) {
      this.getQSet(nextProps.qSetId);
    }
  }
  render() {
    return (
      <div>
        <Card>
          <CardTitle
            title={this.props.qSetTitle}
            subtitle={this.props.qSetIntro}
          />
          <CardText>
            <TextField
              hintText="Question Title"
              value={this.state.questionTitle}
              onChange={(e, v) =>
                this.setState({
                  questionTitle: v
                })}
            />
            <br />
            <TextField
              hintText="Question Type"
              value={this.state.questionType}
              onChange={(e, v) =>
                this.setState({
                  questionType: v
                })}
            />
            <br />
            <TextField
              hintText="Question Content"
              value={this.state.questionText}
              multiLine={true}
              onChange={(e, v) =>
                this.setState({
                  questionText: v
                })}
            />
            <br />
            <List>
              {this.state.option.map(
                e =>
                  e
                    ? <ListItem
                        primaryText={e.text}
                        rightIcon={
                          e.isCorrect ? <CorrectIcon /> : <WrongIcon />
                        }
                        key={e.text}
                        onTouchTap={() =>
                          window.confirm(
                            "Do you really want to delete option " +
                              e.text +
                              " ?"
                          )
                            ? this.setState(prevState => ({
                                option: prevState.option.map(
                                  opt => (opt === e ? null : opt)
                                )
                              }))
                            : null}
                      />
                    : null
              )}
            </List>
            <TextField
              hintText="New Option"
              value={this.state.currentOption}
              multiLine={true}
              onChange={(e, v) =>
                this.setState({
                  currentOption: v
                })}
            />
            <Checkbox
              checked={this.state.currentOptionIsCorrect}
              onCheck={(e, v) => this.setState({ currentOptionIsCorrect: v })}
              checkedIcon={<CorrectIcon />}
              uncheckedIcon={<WrongIcon />}
              label="Is new option correct?"
            />
          </CardText>
          <CardActions>
            <FlatButton
              label="Add Option"
              onTouchTap={e =>
                this.setState((prevState, props) => ({
                  option: [
                    ...prevState.option,
                    {
                      text: prevState.currentOption,
                      isCorrect: prevState.currentOptionIsCorrect
                    }
                  ],
                  currentOption: "",
                  currentOptionIsCorrect: false
                }))}
            />
            <FlatButton
              label="Sumbit"
              onTouchTap={e => {
                if (this.state.questionText) {
                  request(
                    window.serverUrl,
                    `
                    mutation newQuestion($input: createQuestionsInput!) {
                      createQuestions(input:$input){
                        nodes{
                          newQuestions{
                            questionId
                          }
                        }
                      }
                    }
                    `,
                    {
                      input: {
                        values: [
                          {
                            questionSetId: parseInt(this.props.qSetId),
                            questionTitle: this.state.questionTitle,
                            questionContent: this.state.questionText,
                            questionType: this.state.questionType,
                            questionCreateTimestamp: "",
                            questionLastUpdateTimestamp: ""
                          }
                        ]
                      }
                    }
                  )
                    .then(data =>
                      Promise.all(
                        this.state.option.map(
                          (opt: { text: string, isCorrect: boolean }) =>
                            request(
                              window.serverUrl,
                              `
                            mutation newQuestionAnswer($input: createQuestionAnswersInput!) {
                              createQuestionAnswers(input:$input){
                                clientMutationId
                              }
                            }
                            `,
                              {
                                input: {
                                  values: opt
                                    ? [
                                        {
                                          questionId:
                                            data.createQuestions.nodes[0]
                                              .newQuestions.questionId,
                                          questionAnswerText: opt.text,
                                          questionAnswerIsCorrect:
                                            opt.isCorrect,
                                          questionAnswerCreateTimestamp: "",
                                          questionAnswerLastUpdateTimestamp: ""
                                        }
                                      ]
                                    : []
                                }
                              }
                            )
                        )
                      )
                    )
                    .then(d => {
                      window.alert("New Question created");
                      this.setState({
                        qSetTitle: "",
                        qSetIntro: "",
                        questionTitle: "",
                        questionType: "",
                        questionText: "",
                        correctOption: 0,
                        option: [],
                        currentOption: "",
                        currentOptionIsCorrect: false
                      });
                    })
                    .catch(err => {
                      console.log(err);
                      window.alert("Internal Error, please try again later");
                    });
                } else {
                  window.alert("Did you miss some information?");
                }
              }}
            />
          </CardActions>
        </Card>
      </div>
    );
  }
}
