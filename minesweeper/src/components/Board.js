import React from 'react';
import Square from './Square';

export default class Board extends React.Component {
  constructor(props){
    super(props);

    const totalSquares = this.props.size * this.props.size;
    const mineSquares = this.layMines(this.props.size, this.props.mines);

    this.state = {
      squareValues: Array(totalSquares).fill(null),
      mineSquares: mineSquares,
      size: this.props.size,
      mines: this.props.mines
    };
  }

  // ------- Initialization -------
  layMines(size, mines) {
    const totalSquares = size * size;
    var mineSquares = Array(totalSquares).fill(0);
    var mineIndex = 0;

    for(var i = 0; i < mines; i++) {
      mineIndex = Math.round(Math.random() * (totalSquares));

      // Don't lay a mine in a square that already has a mine
      while(mineIndex > totalSquares || mineSquares[mineIndex] === 1) {
        mineIndex = Math.round(Math.random() * (totalSquares));
      }

      mineSquares[mineIndex] = 1;
    }

    return (mineSquares);
  }

  // ------- Event Handling -------
  guessMineSpace(squareIndex) {
    const squareValues = this.state.squareValues.slice();
    const mineSquares = this.state.mineSquares.slice();

    // Check for mine on requested space and set value response
    var value = (mineSquares[squareIndex] === 1 ? '*' : '-' )
    squareValues[squareIndex] = value;

    this.setState({squareValues: squareValues});
  }

  // ------- Rendering -------
  renderSquare(i) {
    return (
      <Square
        id={i}
        value={ this.state.squareValues[i] }
        onClick={ () => this.guessMineSpace(i) }
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