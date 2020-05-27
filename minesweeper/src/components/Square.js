import React from 'react';

export default class Square extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      id: props.id
    }
  }

  getSquareClass(value) {
    var className = 'square';

    // Refactor to Switch Statement
    if (value == '*') {
      className += ' selected-mine';
    } else if (value == null) {
      className += ' unselected';
    } else if (value == '-') {
      className += ' selected-safe';
    } else {
      className += ' selected-clue';
    }

    return (className);
  }

  render() {
    return (
      <button
        className = { this.getSquareClass(this.props.value) }
        onClick={() => this.props.onClick()}
      >
        {this.props.value === '-' ? '' : this.props.value}
      </button>
    );
  }
}