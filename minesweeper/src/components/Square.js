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

    switch (value) {
      case '*':
        className += ' selected-mine';
        break;
      case '-' :
        className += ' selected-safe';
        break;
      case null:
      case 'F':
        className += ' unselected';
        break;
      default:
        className += ' selected-clue';
        break;
    }

    return (className);
  }

  render() {
    return (
      <button
        className = { this.getSquareClass(this.props.value) }
        onClick={() => this.props.onClick()}
        onContextMenu={() => this.props.onContextMenu()}
      >
        {this.props.value === '-' || this.props.value == 0 ? '' : this.props.value}
      </button>
    );
  }
}