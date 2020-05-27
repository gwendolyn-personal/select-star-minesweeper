import React from 'react';
import Square from './Square';

export default class Board extends React.Component {
  constructor(props){
    super(props);

    const totalSquares = this.props.size * this.props.size;
    const mineSquares = this.layMines(this.props.size, this.props.mines);
    const clueSquares = this.hideClues(mineSquares, this.props.size);

    this.state = {
      squareValues: Array(totalSquares).fill(null),
      mineSquares: mineSquares,
      clueSquares: clueSquares,
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

  hideClues(mineSquares, size) {
    var clueSquares = Array(mineSquares.length).fill(0);

    for(var i = 0; i < mineSquares.length; i++) {
      if (i > size && this.hasMineAbove(i, size, mineSquares) == true) {
        clueSquares[i]++;
      }

      if (i < (mineSquares.length - size) && this.hasMineBelow(i, size, mineSquares) == true) {
        clueSquares[i]++;
      }

      if ((i + 1) % size != 0) {
        if (this.hasMineRight(i, mineSquares) === true) {
          clueSquares[i]++;
        }
        if (i > size && this.hasMineRightAbove(i, size, mineSquares) === true) {
          clueSquares[i]++;
        }
        if (i < (mineSquares.length - size) && this.hasMineRightBelow(i, size, mineSquares) === true) {
          clueSquares[i]++;
        }
      }

      if (i % size != 0) {
        if (this.hasMineLeft(i, mineSquares) === true) {
          clueSquares[i]++;
        }
        if (i > size && this.hasMineLeftAbove(i, size, mineSquares) === true) {
          clueSquares[i]++;
        }
        if (i < (mineSquares.length - size) && this.hasMineLeftBelow(i, size, mineSquares) === true) {
          clueSquares[i]++;
        }
      }
    }

    return (clueSquares);
  }

  hasMineAbove(treasure, size, mineSquares) {
    var hasMine = false;
    var treasureIndex = treasure - size;

    if (mineSquares[treasureIndex] === 1) {
      hasMine = true;
    }

    return (hasMine);
  }

  hasMine(index, mineSquares) {
    var hasMine = false;

    if (mineSquares[index] === 1) {
      hasMine = true;
    }

    return (hasMine);
  }

  hasMineBelow(treasure, size, mineSquares) {
    return (this.hasMine((treasure + size), mineSquares));
  }

  hasMineAbove(treasure, size, mineSquares) {
    return (this.hasMine((treasure - size), mineSquares));
  }

  hasMineRight(treasure, mineSquares) {
    return (this.hasMine((treasure + 1), mineSquares));
  }

  hasMineRightAbove(treasure, size, mineSquares) {
    return (this.hasMine((treasure - size + 1), mineSquares));
  }

  hasMineRightBelow(treasure, size, mineSquares) {
    return (this.hasMine((treasure + size + 1), mineSquares));
  }

  hasMineLeft(treasure, mineSquares) {
    return (this.hasMine((treasure - 1), mineSquares));
  }

  hasMineLeftAbove(treasure, size, mineSquares) {
    return (this.hasMine((treasure - size - 1), mineSquares));
  }

  hasMineLeftBelow(treasure, size, mineSquares) {
    return (this.hasMine((treasure + size - 1), mineSquares));
  }

  // ------- Event Handling -------
  guessMineSpace(squareIndex) {
    const squareValues = this.state.squareValues.slice();
    const mineSquares = this.state.mineSquares.slice();
    var value = '-';
    var minesRemaining = this.state.mines;

    // Check for mine on requested space and set value response
    if (mineSquares[squareIndex] === 1) {
      value = '*';
      minesRemaining--;
    }

    squareValues[squareIndex] = value;

    this.setState(
      {
        squareValues: squareValues,
        mines: minesRemaining
      }
    );
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
        <div class="mines-remaining">{ this.state.mines }</div>
        { this.renderRows() }
      </div>
    );
  }
}