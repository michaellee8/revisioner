import base from '../../base.js';
import Question from './question'
import React, { Component } from 'react'
import Snackbar from 'material-ui/Snackbar'
import { Card, CardActions, CardTitle } from 'material-ui/Card'
import CorrectIcon from 'material-ui/svg-icons/action/done'
import WrongIcon from 'material-ui/svg-icons/content/clear'
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh'
import IconButton from 'material-ui/IconButton'
import Badge from 'material-ui/Badge'

class QuestionList extends Component {
  state: {
    QuestionSet: Array<any>,
    shouldRenderQuestion: Array<boolean>,
    numberOfCorrectAnswers: number,
    numberOfWrongAnswers: number
  }
  props: {
    firebaseEndPoint: string,
    teacher: {name: string, intro: string, avatar: string}
  }
  constructor(props) {
    super(props);
    this.state = {
      QuestionSet: [],
      shouldRenderQuestion: [],
      reflectionOpen: false,
      reflectionText: "",
      numberOfCorrectAnswers: 0,
      numberOfWrongAnswers: 0
    };
    this.handleOptionClick = this.handleOptionClick.bind(this);
  }

  componentWillMount() {
    this.getQuestionSet();
  }
  getQuestionSet() {
    base.fetch(this.props.firebaseEndPoint, {
      context: this,
      asArray: true
    }).then(data => {
      var tmp = [];
      for (var i = 0; i < data.length; i++) {
        tmp[i] = true;
      }
      this.setState({
        QuestionSet: data,
        shouldRenderQuestion: tmp
      });
    }).catch(error => alert("Cannot fetch questions\n" + error));
  }

  handleOptionClick(index, questionNumber) {
    if (this.state.QuestionSet[questionNumber].q.correctOption === index) {
      this.setState({
        reflectionOpen: true,
        reflectionMessage: "Correct!"
      });
      this.setState((prevState, props) => ({
        numberOfCorrectAnswers: prevState.numberOfCorrectAnswers + 1
      }));
    } else {
      this.setState({
        reflectionOpen: true,
        reflectionMessage: "Wrong!"
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
    return (<div>
              { this.state.QuestionSet.map((q, i) => (
                  <Question
                    authorName={ this.props.teacher.name }
                    authorIntro={ this.props.teacher.intro }
                    authorAvatar={ this.props.teacher.avatar }
                    questionTitle={ q.q.questionTitle }
                    questionType={ q.q.questionType }
                    questionText={ q.q.text }
                    options={ q.q.option }
                    onOptionClick={ this.handleOptionClick }
                    shouldRender={ this.state.shouldRenderQuestion[i] }
                    questionNumber={ i } />)) }
              <Card>
                <CardTitle>
                  Done!
                </CardTitle>
                <CardActions>
                  <IconButton>
                    <Badge
                      badgeContent={ this.state.numberOfCorrectAnswers }
                      primary={ true }>
                      <CorrectIcon/>
                    </Badge>
                  </IconButton>
                  <IconButton>
                    <Badge
                      badgeContent={ this.state.numberOfWrongAnswers }
                      secondary={ true }>
                      <WrongIcon/>
                    </Badge>
                  </IconButton>
                  <IconButton onTouchTap={ () => (window.location.reload()) }>
                    <RefreshIcon/>
                  </IconButton>
                </CardActions>
              </Card>
              <Snackbar
                open={ this.state.reflectionOpen }
                message={ this.state.reflectionMessage }
                autoHideDuration={ 4000 } />
            </div>);
  }
}

export default QuestionList;