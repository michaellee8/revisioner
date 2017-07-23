import base from '../../base.js';
import Question from './question'
import React, { Component } from 'react'
import Snackbar from 'material-ui/Snackbar'

class QuestionList extends Component {
  state: {
    QuestionSet: Array<any>,
    shouldRenderQuestion: Array<boolean>
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
      reflectionText: false
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
    } else {
      this.setState({
        reflectionOpen: true,
        reflectionMessage: "Wrong!"
      });
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
              <Snackbar
                open={ this.state.reflectionOpen }
                message={ this.state.reflectionMessage }
                autoHideDuration={ 4000 } />
            </div>);
  }
}

export default QuestionList;