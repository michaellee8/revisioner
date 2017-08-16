import React, { Component } from "react";
import CorrectIcon from "material-ui/svg-icons/action/done";
import {
  Card,
  CardText,
  CardActions,
  CardTitle,
  CardHeader
} from "material-ui/Card";
import List from "material-ui/List";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import WrongIcon from "material-ui/svg-icons/content/clear";

class Editor extends Component {
  props: {
    SetTitle: string,
    SetSubtitle: string,
    SetId: string,
    sumbitHandler: Function
  };
  state: {
    questionTitle: string,
    questionType: string,
    questionText: string,
    correctOption: number,
    option: Array<string>,
    currentOption: string
  };
  constructor(props) {
    super(props);
    this.setState({ correctOption: 0, currentOption: "", option: [] });
  }
  sumbit() {
    return JSON.stringify({
      questionTitle: this.state.questionTitle,
      questionType: this.state.questionType,
      questionText: this.state.questionText,
      correctOption: this.state.correctOption,
      option: this.state.option,
      setId: this.props.SetId
    });
  }
  render() {
    return (
      <div>
        <Card>
          <CardHeader
            title={this.props.SetTitle}
            SetSubtitle={this.props.SetSubtitle}
          />
          <CardText>
            <TextField
              hintText="Question Title"
              onChange={(e, v) =>
                this.setState({
                  questionTitle: v
                })}
            />
            <br />
            <TextField
              hintText="Question Type"
              onChange={(e, v) =>
                this.setState({
                  questionType: v
                })}
            />
            <br />
            <TextField
              hintText="Question Text"
              multiLine={true}
              onChange={(e, v) =>
                this.setState({
                  questionText: v
                })}
            />
            <br />
            <div>First Option is correct</div>
            <List>
              {this.state.option.map((value, index) => {
                if (index === 0) {
                  return (
                    <div>
                      <CorrectIcon />
                      {value}
                    </div>
                  );
                } else {
                  return (
                    <div>
                      <WrongIcon />
                      {value}
                    </div>
                  );
                }
              })}
            </List>
            <br />
            <TextField
              hintText="New Option"
              value={this.state.currentOption}
              onChange={(e, v) =>
                this.setState({
                  currentOption: v
                })}
            />
          </CardText>
          <CardActions>
            <FlatButton
              label="Add Option"
              onTouchTap={e =>
                this.setState((prevState, props) => ({
                  option: [...prevState.option, prevState.currentOption],
                  currentOption: ""
                }))}
            />
            <FlatButton
              label="Sumbit"
              onTouchTap={this.props.sumbitHandler(this.sumbit())}
            />
          </CardActions>
        </Card>
      </div>
    );
  }
}
