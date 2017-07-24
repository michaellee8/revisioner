import React, { Component } from 'react';
import { Card, CardHeader, CardTitle, CardText } from 'material-ui/Card'
import OptionsList from './options-list'
import Paper from 'material-ui/Paper'

class Question extends Component {
  constructor(props) {
    super(props);
    this.handleOptionClick = this.handleOptionClick.bind(this);
  }
  props: {
    authorName: string,
    authorIntro: string,
    authorAvatar: string,
    questionTitle: string,
    questionType: string,
    questionText: string,
    options: Array<string>,
    onOptionClick: Function,
    questionNumber: number,
    correctOption: number
  }
  handleOptionClick(index: number, qNumber: number) {
    this.props.onOptionClick(index, this.props.questionNumber);
  }
  render() {
    return (
      <Card>
        <CardHeader
          title={ this.props.authorName }
          subtitle={ this.props.authorIntro }
          avatar={ this.props.authorAvatar } />
        <CardTitle
          title={ this.props.questionTitle }
          subtitle={ this.props.questionType } />
        <CardText>
          <Paper>
            <div
              style={ {
                        fontSize: "16px"
                      } }
              dangerouslySetInnerHTML={ {
                                          __html: this.props.questionText.replace(/{{([^{}]*)}}/g, (match, p1) => {
                                            if (p1 === "") {
                                              return "<span style='text-decoration: underline'>______</span>";
                                            } else {
                                              return "<span style='text-decoration: underline;'>_" + p1 + "_</span>"
                                            }
                                          })
                                        } }></div>
          </Paper>
          <OptionsList
            options={ this.props.options }
            onOptionClick={ this.handleOptionClick }
            correctOption={ this.props.correctOption } />
        </CardText>
      </Card>
      );
  }
}

export default Question;