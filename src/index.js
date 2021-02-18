import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import update from 'immutability-helper';

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
        squares: Array.from(Array(3), () => new Array(3)),
        row: null,
        col: null,
        value: null,
        isCurrent: true
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }


  //Execute whenever state is changed.
  componentDidUpdate() {
    console.log(this.state.history, "new");    
  }

  // To clear exisiting bold style.
  clearBold()
  {
    this.state.history.forEach(o => 
      o.isCurrent = false
    )
  }

  handleClick(i) {
    this.clearBold()
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares) || squares[i.row][i.col]) {
      return;
    }

    // May not be an exact situation, but still give you an idea how to setState for nested array.
    // https://stackoverflow.com/questions/51433182/set-state-of-nested-array

    // Had to create a separate array. All nested arrays get overwritten with the current data when 2 dimensional sqaures array is used unlike the original 1 dimensional sqaures array.
    let arr = [[null,null,null],[null,null,null],[null,null,null]];

    // o is each sqaures array element object
    // ri is the row index
    // ci is the col index
    squares.map((o, ri) => {
      o.map((obj, ci) => {
        if(squares[ri][ci]) {
          arr[ri][ci] = squares[ri][ci];
        }
      });
    })

    // Doing slice as below won't make it work instead of map chaining....
    // arr = squares.slice()

    arr[i.row][i.col] = this.state.xIsNext ? 'X' : 'O'

    //
    //console.log("Row: " + i.row + ", Col: " + i.col + ", Val: " + squares[i.row][i.col])
    //

    this.setState({
      history: history.concat([
        {
          squares: arr,
          row: [i.row],
          col: [i.col],
          value: arr[i.row][i.col],
          isCurrent: true
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
    this.clearBold()
    this.state.history[step].isCurrent = true
    this.setState({
      history: this.state.history,
      stepNumber: step,
      // xIsNext is true when it's step number is even.
      // The first step is always X, so any moves by O are even.
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      //const desc = move ? 'Go to move #' + move : 'Go to game start';
      const desc = move ? step.value + ' is placed at row - ' + step.row + ', column - ' + step.col : 'Go to game start';
      if (step.isCurrent) {
        return (
          <li key={move}>
            <button className='boldOnSelect' onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
      else {
        return (
          <li key={move}>
            <button className='unboldOthers' onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
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