import React from 'react';

export default class Square extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      id: props.id
    }
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}