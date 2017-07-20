import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card'
import { List, ListItem } from 'material-ui/List'
import { OptionsList } from '.\options-list'

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
    onOptionClick: Function;
  }
  handleOptionClick(index: number) {
    this.props.onOptionClick(index);
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
          { this.props.questionText }
          <Divider/>
          <OptionsList
            options={ this.props.options }
            onOptionClick={ this.handleOptionClick } />
        </CardText>
      </Card>
      );
  }
}

export default Question;