import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/Board';
import './index.scss';

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board size={8} mines={8} />
        </div>
        <div className="game-info">
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
