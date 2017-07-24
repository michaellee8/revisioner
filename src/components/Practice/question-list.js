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
import LinearProgress from 'material-ui/LinearProgress'
import { List, ListItem } from 'material-ui/List'

class QuestionList extends Component {
  state: {
    QuestionSet: Array<any>,
    shouldRenderQuestion: Array<boolean>,
    reflectionOpen: boolean,
    reflectionText: string,
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
    return (<div>
              <List>
                { this.state.QuestionSet.map((q, i) => (
                    <ListItem disabled={ true }>
                      <Question
                        key={ JSON.stringify(q.q) }
                        authorName={ this.props.teacher.name }
                        authorIntro={ this.props.teacher.intro }
                        authorAvatar={ this.props.teacher.avatar }
                        questionTitle={ q.q.questionTitle }
                        questionType={ q.q.questionType }
                        questionText={ q.q.text }
                        options={ q.q.option }
                        onOptionClick={ this.handleOptionClick }
                        questionNumber={ i }
                        correctOption={ q.q.correctOption } />
                    </ListItem>)) }
                <ListItem disabled={ true }>
                  { this.state.QuestionSet.length > 0 ? (
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
                    ) : (
                    <Card>
                      <CardTitle>
                        Please wait
                        <LinearProgress/>
                      </CardTitle>
                    </Card>
                    ) }
                </ListItem>
              </List>
              <Snackbar
                open={ this.state.reflectionOpen }
                message={ this.state.reflectionText }
                autoHideDuration={ 4000 } />
            </div>);
  }
}

export default QuestionList;