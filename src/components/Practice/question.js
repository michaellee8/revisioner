import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardText,
  CardActions
} from "material-ui/Card";
import OptionsList from "./options-list";
import Paper from "material-ui/Paper";
import FlatButton from "material-ui/FlatButton";
import Popover from "material-ui/Popover";
import { request } from "graphql-request";
import firebase from "firebase";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import Dialog from "material-ui/Dialog";
import { IntlProvider, FormattedRelative } from "react-intl";
import { List, ListItem } from "material-ui/List";
import TextField from "material-ui/TextField";

class Question extends Component {
  constructor(props) {
    super(props);
    this.handleOptionClick = this.handleOptionClick.bind(this);
    this.state = {
      openComments: false,
      openReactions: false,
      anchorEl: null,
      showManage: false,
      showComments: false,
      newComment: "",
      disableReactions: false
    };
  }
  props: {
    qSetTitle: string,
    lastUpdate: string,
    authorName: string,
    authorIntro: string,
    authorAvatar: string,
    authorFirebaseId: string,
    questionTitle: string,
    questionType: string,
    questionText: string,
    options: Array<{
      questionAnswerText: string,
      questionAnswerIsCorrect: boolean,
      questionAnswerId: number,
      questionSumbits: { total: number }
    }>,
    onOptionClick: Function,
    questionNumber: number,
    comments: Array<any>,
    commentsCount: number,
    reactionsCount: number,
    qId: number,
    qSetId: number,
    isFollow: boolean
  };
  state: {
    openComments: boolean,
    openReactions: boolean,
    showManage: boolean,
    showComments: boolean,
    anchorEl: any,
    newComment: string,
    disableReactions: boolean
  };
  handleOptionClick(index: number, qNumber: number) {
    this.props.onOptionClick(index, this.props.questionNumber);
  }
  render() {
    return (
      <Card>
        <CardHeader
          title={this.props.authorName}
          subtitle={"@" + this.props.qSetTitle}
          avatar={
            this.props.authorAvatar
              ? this.props.authorAvatar
              : "img/default-teacher.png"
          }
        />
        <CardTitle
          title={this.props.questionTitle}
          subtitle={this.props.questionType}
        />
        <CardText>
          <TextField
            value={this.props.questionText}
            multiLine={true}
            disabled={true}
            textareaStyle={{ color: "black" }}
            fullWidth={true}
            underlineShow={false}
          />
          <OptionsList
            options={this.props.options}
            onOptionClick={this.handleOptionClick}
            qId={this.props.qId}
          />
          <IntlProvider locale="en">
            <FormattedRelative value={this.props.lastUpdate} />
          </IntlProvider>
        </CardText>
        <CardActions>
          {firebase.auth().currentUser
            ? <FlatButton
                label={this.props.isFollow ? "FOLLOW" : "UNFOLLOW"}
                onTouchTap={() =>
                  firebase
                    .auth()
                    .currentUser.getToken(true)
                    .catch(err => {
                      console.log(err);
                      this.getQuestionSet();
                    })
                    .then(authToken =>
                      request(
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
                      )
                    )
                    .then(
                      data =>
                        this.props.isFollow
                          ? request(
                              window.serverUrl,
                              `
                          mutation cancelFollow($input:deleteQuestionSetFollowsInput!){
                            deleteQuestionSetFollows(input:$input){
                              affectedCount
                            }
                          }
                          `,
                              {
                                input: {
                                  where: {
                                    questionSetId: this.props.qSetId,
                                    userId: data.users[0].userId
                                  }
                                }
                              }
                            ).then(() =>
                              request(
                                window.serverUrl,
                                `
                          mutation newFollow($input:createQuestionSetFollowsInput!){
                            createQuestionSetFollows(input:$input){
                              affectedCount
                            }
                          }
                          `,
                                {
                                  input: {
                                    values: [
                                      {
                                        userId: data.users[0].userId,
                                        questionSetFollowTimestamp: "",
                                        questionSetId: this.props.qSetId
                                      }
                                    ]
                                  }
                                }
                              )
                            )
                          : request(
                              window.serverUrl,
                              `
                          mutation cancelFollow($input:deleteQuestionSetFollowsInput!){
                            deleteQuestionSetFollows(input:$input){
                              affectedCount
                            }
                          }
                          `,
                              {
                                input: {
                                  where: {
                                    questionSetId: this.props.qSetId,
                                    userId: data.users[0].userId
                                  }
                                }
                              }
                            )
                    )
                    .then(() =>
                      window.alert(
                        (this.props.isFollow ? "Follow" : "Unfollow") +
                          " successful"
                      )
                    )
                    .catch(err => {
                      console.log(err);
                      window.alert("Internal error, please try again later");
                    })}
              />
            : null}
          <FlatButton
            label={this.props.reactionsCount + " " + "Reactions"}
            disabled={this.state.disableReactions}
            onTouchTap={e => {
              firebase.auth().currentUser
                ? this.setState({
                    openReactions: true,
                    anchorEl: e.currentTarget
                  })
                : null;
              e.preventDefault();
            }}
          />

          <Popover
            open={this.state.openReactions}
            onRequestClose={() => this.setState({ openReactions: false })}
            anchorEl={this.state.anchorEl}
          >
            <Menu style={{ position: "static" }}>
              {["DISLIKE", "EASY", "HARD", "LIKE", "NOSEE", "REPORT"].map(v =>
                <MenuItem
                  primaryText={v}
                  onTouchTap={() => {
                    this.setState({
                      openReactions: false,
                      disableReactions: true
                    });
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
                              userFirebaseAuthId: firebase.auth().currentUser
                                .uid
                            }
                          }
                        );
                      })
                      .then(data =>
                        request(
                          window.serverUrl,
                          `
                          mutation newReaction($input:createQuestionReactionsInput!){
                            createQuestionReactions(input:$input){
                              clientMutationId
                            }
                          }
                          `,
                          {
                            input: {
                              values: [
                                {
                                  questionReactionType: v,
                                  userId: data.users[0].userId,
                                  questionReactionTimestamp: "",
                                  questionId: this.props.qId
                                }
                              ]
                            }
                          }
                        )
                      )
                      .catch(err => {
                        console.log(err);
                        window.alert("Internal error, please try again later");
                      });
                  }}
                />
              )}
            </Menu>
          </Popover>
          <FlatButton
            label={this.props.commentsCount + " " + "Comments"}
            onTouchTap={e =>
              this.setState({
                openComments: true,
                anchorEl: e.currentTarget
              })}
          />
          <Dialog
            autoScrollBodyContent={true}
            title="Comments"
            open={this.state.openComments}
            onRequestClose={() => this.setState({ openComments: false })}
            actions={[
              firebase.auth().currentUser
                ? <FlatButton
                    label="COMMENT"
                    onTouchTap={() => {
                      if (this.state.newComment) {
                        this.setState({ openComments: false });
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
                                  userFirebaseAuthId: firebase.auth()
                                    .currentUser.uid
                                }
                              }
                            );
                          })
                          .then(data =>
                            request(
                              window.serverUrl,
                              `
                        mutation newComment($input:createQuestionCommentsInput!){
                          createQuestionComments(input:$input){
                            affectedCount
                          }
                        }
                        `,
                              {
                                input: {
                                  values: [
                                    {
                                      userId: data.users[0].userId,
                                      questionId: this.props.qId,
                                      questionCommentCreateTimestamp: "",
                                      questionCommentLastUpdateTimestamp: "",
                                      questionCommentContent: this.state
                                        .newComment
                                    }
                                  ]
                                }
                              }
                            )
                          )
                          .catch(err => {
                            console.log(err);
                            window.alert(
                              "Internal error, please try again later"
                            );
                          });
                      }
                    }}
                  />
                : null,
              <FlatButton
                label="DONE"
                onTouchTap={() => this.setState({ openComments: false })}
              />
            ]}
          >
            <List>
              {this.props.comments.map(e =>
                <ListItem key={e.questionCommentId} disabled={true}>
                  <Card>
                    <CardHeader
                      title={e.user.userName}
                      avatar={e.user.userPhotoUrl}
                      subtitle={e.questionCommentText}
                    />
                  </Card>
                </ListItem>
              )}

              {firebase.auth().currentUser
                ? <TextField
                    value={this.state.newComment}
                    onChange={(e, v) => this.setState({ newComment: v })}
                    hintText="Your new comment here"
                  />
                : null}
            </List>
          </Dialog>
          {firebase.auth().currentUser &&
          firebase.auth().currentUser.uid === this.props.authorFirebaseId
            ? <FlatButton
                label="MANAGE"
                onTouchTap={() => this.setState({ showManage: true })}
              />
            : null}
          {firebase.auth().currentUser &&
          firebase.auth().currentUser.uid === this.props.authorFirebaseId
            ? <Dialog
                title={
                  "Manage page of question " +
                  (this.props.questionTitle
                    ? this.props.questionTitle
                    : this.props.qId)
                }
                open={this.state.showManage}
                onRequestClose={() => this.setState({ showManage: false })}
                actions={[
                  <FlatButton
                    label="DELETE"
                    onTouchTap={e => {
                      e.preventDefault();
                      window.confirm(
                        "Do you really want to delete this question?"
                      )
                        ? request(
                            window.serverUrl,
                            `
                            mutation cancelQuestion($input:deleteQuestionsInput!){
                              deleteQuestions(input:$input){
                                affectedCount
                              }
                            }
                            `,
                            {
                              input: {
                                where: {
                                  questionId: this.props.qId
                                }
                              }
                            }
                          )
                            .then(() => window.alert("Question deleted"))
                            .catch(err => {
                              window.alert(
                                "Internal error, please try again later"
                              );
                              console.log(err);
                            })
                        : null;
                    }}
                  />,
                  <FlatButton
                    label="DONE"
                    onTouchTap={() => this.setState({ showManage: false })}
                  />
                ]}
              >
                <List>
                  {this.props.options.map(
                    (e: {
                      questionAnswerText: string,
                      questionAnswerIsCorrect: boolean,
                      questionAnswerId: number,
                      questionSumbits: { total: number }
                    }) =>
                      <ListItem
                        primaryText={e.questionAnswerText}
                        secondaryText={e.questionSumbits.total.toString()}
                        disabled={true}
                      />
                  )}
                </List>
              </Dialog>
            : null}
        </CardActions>
      </Card>
    );
  }
}

export default Question;
