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

    if (value == '*') {
      className += ' selected-mine';
    } else if (value == '-') {
      className += ' selected-safe';
    } else {
      className += ' unselected';
    }

    return (className);
  }

  render() {
    return (
      <button
        className = { this.getSquareClass(this.props.value) }
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}