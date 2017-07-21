import { List, ListItem } from 'material-ui/List'
import React, { Component } from 'react'

class OptionsList extends Component {
  props: {
    options: Array<String>,
    onOptionClick: Function
  }
  constructor(props) {
    super(props);
    this.handleOptionClick = this.handleOptionClick.bind(this);
  }
  shuffleArr(a) {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
  }

  handleOptionClick(i: number) {
    this.props.onOptionClick(i);
  }

  render() {
    const randArr = this.shuffleArr(this.props.options.map((v, i) => ({
      value: v,
      index: i
    })));
    const elements = randArr.map((v, i) => (
      <ListItem
        primaryText={ v.value }
        onTouchTap={ () => {
                       this.handleOptionClick(v.index)
                     } } />)
    );
    return (
      <List>
        { elements }
      </List>
      );
  }
}

export default OptionsList;