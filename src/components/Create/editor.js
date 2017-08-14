import React, { Components } from "react";
import CorrectIcon from 'material-ui/svg-icons/action/done'
import { Card, CardText, CardActions, CardTitle } from 'material-ui/Card'


class Editor extends React.Components {
  props: {
    SetTitle: string,
    SetSubtitle: string,
    sunbitHandler: Function
  }
  state: {
    questionTitle: string,
    questionType: string,
    questionText: string,
    correctOption: number,
    option: Array<string>,
    currentOption: string
  }
  constructor(props) {
    this.state.correctOption = 0;
    this.state.currentOption = "";
    this.state.option = [];
  }
  sumbit() {
    return JSON.stringify({
      questionTitle: this.state.questionTitle,
      questionType: this.state.questionType,
      questionText: this.state.questionText,
      correctOption: this.state.correctOption,
      option: this.state.option
    });
  }
  render() {
    return (<div>
              <Card>
                <CardHeader
                  title={ SetTitle }
                  SetSubtitle={ SetSubtitle } />
                <CardText>
                  <TextField
                    hintText="Question Title"
                    onChange={ (e, v) => this.setState({
                                 questionTitle: v
                               }) } />
                  <br/>
                  <TextField
                    hintText="Question Type"
                    onChange={ (e, v) => this.setState({
                                 questionType: v
                               }) } />
                  <br/>
                  <TextField
                    hintText="Question Text"
                    multiLine={ true }
                    onChange={ (e, v) => this.setState({
                                 questionText: v
                               }) } />
                  <br/>
                  <div>
                    First Option is correct
                  </div>
                  <List>
                    { this.state.option.map((value, index) => {
                        if (index === 0) {
                          return (<div>
                                    <CorrectIcon/>
                                    { value }
                                  </div>);
                        } else {
                          return (<div>
                                    <WrongIcon/>
                                    { value }
                                  </div>);
                        }
                      }) }
                  </List>
                  <br/>
                  <TextField
                    hintText="New Option"
                    value={ thi.state.currentOption }
                    onChange={ (e, v) => this.setState({
                                 currentOption: v
                               }) } />
                </CardText>
                <CardAction>
                  <FlatButton
                    label="Add Option"
                    onTouchTap={ (e) => this.setState((prevState, props) => ({
                                   option: [...prevState.option, prevState.currentOption],
                                   currentOption: ""
                                 })) } />
                  <FlatButton
                    label="Sumbit"
                    onTouchTap={ this.props.sumbitHandler(this.sumbit()) } />
                </CardAction>
              </Card>
            </div>);
  }
}
