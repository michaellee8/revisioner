import { List, ListItem } from "material-ui/List";
import React, { Component } from "react";
import CorrectIcon from "material-ui/svg-icons/action/done";
import WrongIcon from "material-ui/svg-icons/content/clear";

class OptionsList extends Component {
  props: {
    options: Array<{
      questionAnswerText: string,
      questionAnswerIsCorrect: boolean,
      questionAnswerId: number
    }>,
    onOptionClick: Function
  };
  state: {
    selected: boolean,
    selectedOption: number,
    selectedCorrect: boolean
  };
  constructor(props) {
    super(props);
    this.handleOptionClick = this.handleOptionClick.bind(this);
    this.state = {
      selected: false,
      selectedOption: 0,
      selectedCorrect: false
    };
    this.selected = false;
    this.randArr = this.shuffleArr(
      this.props.options.map((v, i) => ({
        value: v,
        index: i
      }))
    );
    console.log(this.randArr);
  }
  shuffleArr(a) {
    if (this.selected) {
      return a;
    }
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
  }

  handleOptionClick(i: number) {
    if (!this.state.selected) {
      this.selected = true;
      this.setState({
        selected: true,
        selectedOption: i,
        selectedCorrect: i === this.props.correctOption
      });
      this.props.onOptionClick(i);
    }
  }

  render() {
    const elements = this.randArr.map(
      (v, i) =>
        this.state.selected && this.state.selectedOption === v.index
          ? <ListItem
              key={JSON.stringify({
                ...v,
                s: this.state
              })}
              primaryText={
                <div>
                  {v.value.questionAnswerIsCorrect
                    ? <CorrectIcon />
                    : <WrongIcon />}
                  <span>
                    {v.value.questionAnswerText}
                  </span>
                </div>
              }
              onTouchTap={() => {
                this.handleOptionClick(v.index);
              }}
            />
          : <ListItem
              key={JSON.stringify({
                ...v,
                s: this.state
              })}
              primaryText={
                <div>
                  <span>
                    {v.value.questionAnswerText}
                  </span>
                </div>
              }
              onTouchTap={() => {
                this.handleOptionClick(v.index);
              }}
            />
    );
    return (
      <List>
        {elements}
      </List>
    );
  }
}

export default OptionsList;
