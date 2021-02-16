import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
  return (
    <button
      className="square"
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(row, col) {
    return <Square value={this.props.squares[row][col]} onClick={() => this.props.onClick({row, col})} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, 0)}
          {this.renderSquare(0, 1)}
          {this.renderSquare(0, 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(1, 0)}
          {this.renderSquare(1, 1)}
          {this.renderSquare(1, 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(2, 0)}
          {this.renderSquare(2, 1)}
          {this.renderSquare(2, 2)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(3).fill(null).map(() => Array(3).fill(null))
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares) || squares[i.row][i.col]) {
      return;
    }

    squares[i.row][i.col] = this.state.xIsNext ? 'X' : 'O'

    //
    //console.log("Row: " + i.row + ", Col: " + i.col + ", Val: " + squares[i.row][i.col])
    //

    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      // xIsNext property will allow the state goes between X and O.
      // xIsNext is true by default. The first click will show X and xIsNext becomes false.
      // This makes the next click show O.
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      // xIsNext is true when it's step number is even.
      // The first step is always X, so any moves by O are even.
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history
    history.forEach(a =>
      console.log(a)
    )
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });


    let status
    if (winner) {      
      status = 'Winner: ' + winner;    
    } else {      
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');    
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// old function when using just a number on each square.
function calculateWinnerOld(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // squares[a] is going to be null, X or O.
    // if (squares[a]) will check for
    // undefined, null, '', 0, NaN, false
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function calculateWinner(squares) {

  // Horizontal check
  for (var i = 0; i < 3; i++) {
    if (squares[i][0] && squares[i][0] === squares[i][1] && squares[i][0] === squares[i][2]) {
      return squares[i][0];
    }
  }

  // Vertical check
  for (var i = 0; i < 3; i++) {
    if (squares[0][i] && squares[0][i] === squares[1][i] && squares[0][i] === squares[2][i]) {
      return squares[0][i];
    }
  }

  // Diagonal check 1
  if (squares[0][0] && squares[0][0] === squares[1][1] && squares[0][0] === squares[2][2]) {
    return squares[0][0];
  }

  // Diagonal check 2
  if (squares[2][0] && squares[2][0] === squares[1][1] && squares[2][0] === squares[0][2]) {
    return squares[2][0];
  }

  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);