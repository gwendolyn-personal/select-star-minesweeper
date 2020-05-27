import React from 'react';
import Square from './Square';

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

  renderSquare(i) {
    return (
      <Square
        id={i}
        value={ this.state.squareValues[i] }
      />
    );
  }

  renderRow(rowNum) {
    var squareList = [];
    var firstSquare = rowNum * 8;

    for (var i=0; i<this.state.size; i++){
      squareList.push(this.renderSquare(firstSquare + i));
    }

    return squareList;
  }

  renderRows() {
    var rowList = [];

    for (var i=0; i<this.state.size; i++){
      rowList.push(<div className="board-row">{ this.renderRow(i) }</div>);
    }

    return rowList;
  }

  render() {
    return (
      <div>
        { this.renderRows() }
      </div>
    );
  }
}