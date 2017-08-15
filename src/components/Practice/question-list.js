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

class QuestionList extends Component {
  state: {
    shouldRenderQuestion: Array<boolean>,
    reflectionOpen: boolean,
    reflectionText: string,
    numberOfCorrectAnswers: number,
    numberOfWrongAnswers: number
  };
  props: {
    QuestionSet: Array<any>
  };
  constructor(props) {
    super(props);
    this.state = {
      shouldRenderQuestion: [],
      reflectionOpen: false,
      reflectionText: "",
      numberOfCorrectAnswers: 0,
      numberOfWrongAnswers: 0
    };
    this.handleOptionClick = this.handleOptionClick.bind(this);
  }

  componentWillMount() {}

  handleOptionClick(index, questionNumber) {
    if (this.props.QuestionSet[questionNumber].q.correctOption === index) {
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
        <List>
          {this.props.QuestionSet.map((q, i) =>
            <ListItem key={JSON.stringify(q)} disabled={true}>
              <Question
                authorName={q.author.authorName}
                authorIntro={q.author.authorIntro}
                authorAvatar={q.author.authorAvatar}
                questionTitle={q.questionTitle}
                questionType={q.questionType}
                questionText={q.text}
                options={q.option}
                onOptionClick={this.handleOptionClick}
                questionNumber={i}
                correctOption={q.correctOption}
              />
            </ListItem>
          )}
          <ListItem disabled={true}>
            {this.prop.QuestionSet.length > 0
              ? <Card>
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
              : <Card>
                  <CardTitle>
                    Please wait
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
