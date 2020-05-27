import React from 'react';

export default class Square extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      id: props.id
    }
  }

  render() {
    const {value, onClick, cMenu} = this.props;
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}