import base from "../../base.js";
import Question from "./question";
import React, { Component } from "react";
import Snackbar from "material-ui/Snackbar";
import { Card, CardActions, CardTitle } from "material-ui/Card";
import CorrectIcon from "material-ui/svg-icons/action/done";
import WrongIcon from "material-ui/svg-icons/content/clear";
import RefreshIcon from "material-ui/svg-icons/navigation/refresh";
import IconButton from "material-ui/IconButton";
import Badge from "material-ui/Badge";
import LinearProgress from "material-ui/LinearProgress";
import { List, ListItem } from "material-ui/List";
import Toggle from "material-ui/Toggle";
import Paper from "material-ui/Paper";
import firebase from "firebase";
const VisibilitySensor = require("react-visibility-sensor");

class QuestionList extends Component {
  state: {
    shouldRenderQuestion: Array<boolean>,
    reflectionOpen: boolean,
    reflectionText: string,
    numberOfCorrectAnswers: number,
    numberOfWrongAnswers: number,
    fetching: boolean,
    showSumbittedQuestions: boolean
  };
  props: {
    QuestionSet: Array<any>,
    fetchQ: Function,
    isFollow: boolean
  };
  constructor(props) {
    super(props);
    this.state = {
      shouldRenderQuestion: [],
      reflectionOpen: false,
      reflectionText: "",
      numberOfCorrectAnswers: 0,
      numberOfWrongAnswers: 0,
      fetching: false,
      showSumbittedQuestions: false
    };
    this.handleOptionClick = this.handleOptionClick.bind(this);
  }

  componentWillMount() {}

  handleOptionClick(index, questionNumber) {
    if (
      this.props.QuestionSet[questionNumber].questionAnswers.edges[index].node
        .questionAnswerIsCorrect
    ) {
      this.setState({
        reflectionOpen: true,
        reflectionText: "Correct!"
      });
      this.setState((prevState, props) => ({
        numberOfCorrectAnswers: prevState.numberOfCorrectAnswers + 1
      }));
    } else {
      this.setState({
        reflectionOpen: true,
        reflectionText: "Wrong!"
      });
      this.setState((prevState, props) => ({
        numberOfWrongAnswers: prevState.numberOfWrongAnswers + 1
      }));
    }
    this.setState((prevState, props) => {
      var tmp = prevState.shouldRenderQuestion.slice();
      tmp[questionNumber] = false;
      return {
        shouldRenderQuestion: tmp
      };
    });
  }
  render() {
    return (
      <div>
        <Paper>
          <Toggle
            label="Show sumbitted questions"
            toggled={this.state.showSumbittedQuestions}
            onToggle={(e, v) => this.setState({ showSumbittedQuestions: v })}
          />
        </Paper>
        <List>
          {this.props.QuestionSet.map(
            (q, i) =>
              !(
                this.state.showSumbittedQuestions === false &&
                firebase.auth().currentUser &&
                q.questionReactions.edges.find(
                  obj =>
                    obj.node.questionReactionType === "VIEW" &&
                    obj.node.user.userFirebaseAuthId ===
                      firebase.auth().currentUser.uid
                ) !== undefined
              )
                ? <ListItem
                    key={q.questionId}
                    value={q.questionId}
                    disabled={true}
                  >
                    <Question
                      qId={q.questionId}
                      qSetId={q.questionSet.questionSetId}
                      authorName={q.questionSet.user.userName}
                      authorIntro={q.questionSet.user.userIntro}
                      authorAvatar={q.questionSet.user.userPhotoUrl}
                      authorFirebaseId={q.questionSet.user.userFirebaseAuthId}
                      questionTitle={q.questionTitle}
                      questionType={q.questionType}
                      questionText={q.questionContent}
                      lastUpdate={q.questionLastUpdateTimestamp}
                      options={q.questionAnswers.edges.map(o => ({
                        questionAnswerId: o.node.questionAnswerId,
                        questionAnswerText: o.node.questionAnswerText,
                        questionAnswerIsCorrect: o.node.questionAnswerIsCorrect,
                        questionSumbits: o.node.questionSumbits
                      }))}
                      onOptionClick={this.handleOptionClick}
                      questionNumber={i}
                      comments={q.questionComments.edges.map(o => ({
                        questionCommentId: o.node.questionCommentId,
                        questionCommentText: o.node.questionCommentContent,
                        user: o.node.user
                      }))}
                      commentsCount={q.questionComments.total}
                      reactionsCount={q.questionReactions.total}
                      isFollow={this.props.isFollow}
                      qSetTitle={q.questionSet.questionSetTitle}
                    />
                  </ListItem>
                : null
          )}
          <ListItem disabled={true} value={0}>
            {this.props.QuestionSet.length > 0
              ? <VisibilitySensor
                  onChange={(isVisible: boolean) => {
                    if (isVisible && !this.state.fetching) {
                      this.setState({ fetching: true });
                      this.props.fetchQ(() =>
                        this.setState({ fetching: false })
                      );
                    }
                  }}
                  partialVisibility={true}
                >
                  <Card>
                    <CardTitle>Done!</CardTitle>
                    <CardActions>
                      <IconButton>
                        <Badge
                          badgeContent={this.state.numberOfCorrectAnswers}
                          primary={true}
                        >
                          <CorrectIcon />
                        </Badge>
                      </IconButton>
                      <IconButton>
                        <Badge
                          badgeContent={this.state.numberOfWrongAnswers}
                          secondary={true}
                        >
                          <WrongIcon />
                        </Badge>
                      </IconButton>
                      <IconButton onTouchTap={() => window.location.reload()}>
                        <RefreshIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </VisibilitySensor>
              : <Card>
                  <CardTitle>
                    Please login by clicking the top right corner icon
                    <LinearProgress />
                  </CardTitle>
                </Card>}
          </ListItem>
        </List>
        <Snackbar
          open={this.state.reflectionOpen}
          message={this.state.reflectionText}
          autoHideDuration={4000}
        />
      </div>
    );
  }
}

export default QuestionList;
