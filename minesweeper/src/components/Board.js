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
      mines: this.props.mines,
      minesRemaining: this.props.mines,
      minesFound: 0
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
    const mineSquares = this.state.mineSquares.slice();
    const clueSquares = this.state.clueSquares.slice();
    var squareValues = this.state.squareValues.slice();
    var minesRemaining = this.state.minesRemaining;

    // Check for mine on requested space and set value response
    if (mineSquares[squareIndex] === 1) {
      squareValues[squareIndex] = '*';
      minesRemaining = -1;
    } else {
      // Check for mine clues
      this.revealMineFreeField(squareIndex, clueSquares, squareValues)
    }

    this.setState(
      {
        squareValues: squareValues,
        minesRemaining: minesRemaining
      }
    );
  }

  revealMineFreeField(startingIndex, clueSquares, squareValues) {
    squareValues[startingIndex] = clueSquares[startingIndex] == 0 ? '-' : clueSquares[startingIndex];

    // Base Case: first selection is a clue
    if (clueSquares[startingIndex] > 0) {
      return
    }

    var indexAbove = startingIndex - this.state.size;
    var indexBelow = startingIndex + this.state.size;
    var indexLeft = startingIndex - 1;
    var indexRight = startingIndex + 1;

    // Recursively reveal all non-mine fields above the selected field
    if (startingIndex >= this.state.size) {
      this.revealMineCluesAbove(indexAbove, clueSquares, squareValues);
    }
    // Recursively reveal all non-mine fields below the selected field
    if (startingIndex <= (squareValues.length - this.state.size)) {
      this.revealMineCluesBelow(indexBelow, clueSquares, squareValues);
    }
    // Recursively reveal all non-mine fields to the left of the the selected field
    if (startingIndex % this.state.size != 0) {
      this.revealMineCluesLeft(indexLeft, clueSquares, squareValues);
    }

    // Recursively reveal all non-mine fields to the right of the the selected field
    if ((startingIndex + 1) % this.state.size != 0) {
      this.revealMineCluesRight(indexRight, clueSquares, squareValues);
    }
  }

  revealMineCluesAbove(startingIndex, clueSquares, squareValues) {
    var indexAbove = startingIndex - this.state.size;
    var indexLeft = startingIndex - 1;
    var indexRight = startingIndex + 1;

    squareValues[startingIndex] = clueSquares[startingIndex] == 0 ? '-' : clueSquares[startingIndex];

    // If spaces exist to the left, reveal it if it's a clue (otherwise, it'll be caught with the left/right recursion)
    if (indexLeft % this.state.size != 0) {
      if (clueSquares[indexLeft] > 0) {
        squareValues[indexLeft] = clueSquares[indexLeft];
      }
      else if (indexLeft >= this.state.size && squareValues[indexLeft] == null) {
        this.revealMineCluesAbove(indexLeft, clueSquares, squareValues);
      }
    }

    // If spaces exist to the right, reveal it if it's a clue (otherwise, it'll be caught with the left/right recursion)
    if ((indexRight + 1) % this.state.size != 0) {
      if (clueSquares[indexRight] > 0) {
        squareValues[indexRight] = clueSquares[indexRight];
      } else if (indexRight >= this.state.size && squareValues[indexRight] == null) {
        this.revealMineCluesAbove(indexRight, clueSquares, squareValues);
      }
    }

    // Base case: current clue is not 0 mines, there are no more spaces above to check
    if (clueSquares[startingIndex] > 0 || startingIndex < this.state.size) {
      return;
    } else {
      this.revealMineCluesAbove(indexAbove, clueSquares, squareValues);
    }
  }

  revealMineCluesBelow(startingIndex, clueSquares, squareValues) {
    var indexBelow = startingIndex + this.state.size;
    var indexLeft = startingIndex - 1;
    var indexRight = startingIndex + 1;

    squareValues[startingIndex] = clueSquares[startingIndex] == 0 ? '-' : clueSquares[startingIndex];

    // If spaces exist to the left, reveal it if it's a clue (otherwise, it'll be caught with the left/right recursion)
    if (indexLeft % this.state.size != 0) {
      if (clueSquares[indexLeft] > 0) {
        squareValues[indexLeft] = clueSquares[indexLeft];
      }
      else if ((indexLeft < (squareValues.length - this.state.size) && squareValues[indexLeft] == null)) {
        this.revealMineCluesBelow(indexLeft, clueSquares, squareValues);
      }
    }

    // If spaces exist to the right, reveal it if it's a clue (otherwise, it'll be caught with the left/right recursion)
    if ((indexRight + 1) % this.state.size != 0) {
      if (clueSquares[indexRight] > 0) {
        squareValues[indexRight] = clueSquares[indexRight];
      } else if((indexRight < (squareValues.length - this.state.size) && squareValues[indexLeft] == null)) {
        this.revealMineCluesBelow(indexRight, clueSquares, squareValues);
      }

    }

    // Base case: current clue is not 0 mines, there are no more spaces below to check
    if (clueSquares[startingIndex] > 0 || startingIndex >= (squareValues.length - this.state.size)) {
      return;
    } else {
      this.revealMineCluesBelow(indexBelow, clueSquares, squareValues);
    }
  }

  revealMineCluesLeft(startingIndex, clueSquares, squareValues) {
    squareValues[startingIndex] = clueSquares[startingIndex] == 0 ? '-' : clueSquares[startingIndex];

    // Base case for moving left: current clue is not 0 mines, there are no more spaces to the left to check
    if (clueSquares[startingIndex] > 0) {
      return;
    } else {
      if (startingIndex % this.state.size != 0) {
        this.revealMineCluesLeft(startingIndex - 1, clueSquares, squareValues);
      }

      if (startingIndex >= this.state.size) {
        this.revealMineCluesAbove(startingIndex, clueSquares, squareValues);
      }

      if (startingIndex <= (squareValues.length - this.state.size)) {
        this.revealMineCluesBelow(startingIndex, clueSquares, squareValues);
      }
    }
  }

  revealMineCluesRight(startingIndex, clueSquares, squareValues) {
    squareValues[startingIndex] = clueSquares[startingIndex] == 0 ? '-' : clueSquares[startingIndex];

    // Base case for moving left: current clue is not 0 mines, there are no more spaces to the left to check
    if (clueSquares[startingIndex] > 0) {
      return;
    } else {
      if ((startingIndex + 1) % this.state.size != 0) {
        this.revealMineCluesRight(startingIndex + 1, clueSquares, squareValues);
      }

      if (startingIndex >= this.state.size) {
        this.revealMineCluesAbove(startingIndex, clueSquares, squareValues);
      }

      if (startingIndex <= (squareValues.length - this.state.size)) {
        this.revealMineCluesBelow(startingIndex, clueSquares, squareValues);
      }
    }
  }

  layFlag(squareIndex) {
    const mineSquares = this.state.mineSquares.slice();
    var squareValues = this.state.squareValues.slice();
    var minesRemaining = this.state.minesRemaining;
    var minesFound = this.state.minesFound;

    // event.preventDefault();
    if (squareValues[squareIndex] == null && minesRemaining > 0)
    {
      squareValues[squareIndex] = 'F';
      minesRemaining--;

      if(mineSquares[squareIndex] == 1) {
        minesFound++;
      }
    } else if (squareValues[squareIndex] == 'F') {
      squareValues[squareIndex] = null;
      minesRemaining++;

      if(mineSquares[squareIndex] == 1) {
        minesFound--;
      }
    }

    this.setState(
      {
        squareValues: squareValues,
        minesRemaining: minesRemaining,
        minesFound: minesFound
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
        onContextMenu={() => this.layFlag(i)}
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

  currentGameStatus() {
    var gameStatus = '';

    if (this.state.mines == -1) {
      gameStatus = 'You Lose!';
    } else if (this.state.minesFound == this.state.totalMines) {
      gameStatus = 'You Win!';
    } else {
      gameStatus = 'Mines Remaining: ' + this.state.minesRemaining;
    }

    return (gameStatus);
  }

  render() {
    return (
      <div>
        <div class="game-header">
          <div class="game-title">Minesweeper</div>
          <div class="game-status">{ this.currentGameStatus() }</div>
        </div>
        { this.renderRows() }
      </div>
    );
  }
}