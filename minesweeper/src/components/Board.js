import React from 'react';

export default class Board extends React.Component {
  constructor(props){
    super(props);

    const totalSquares = this.props.size * this.props.size;
    // const mineSquares = this.layMines(this.props.size, this.props.treasures);

    this.state = {
      squareValues: Array(totalSquares).fill(null),
      // mineSquares: mineSquares,
      size: this.props.size,
      mines: this.props.mines
    };
  }

  render() {
    return (
      <div>
        { this.state.mines }
      </div>
    );
  }
}