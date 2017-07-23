import React, { Component } from 'react'
import QuestionList from './question-list'

class Practice extends Component {
  render() {
    return (<QuestionList
              firebaseEndPoint="StaticData/WordExplain/data"
              teacher={ {
                          name: "Michael Lee",
                          intro: "App Developer",
                          avatar: ""
                        } } />);
  }
}

export default Practice;