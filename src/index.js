import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let valueCss = this.props.squares[i];
    if (this.props.winLine.includes(i)) {
      valueCss = <font key={i} style={{color:'red'}}>{valueCss}</font>;
    }
    return (
      <Square key={i}
        value={valueCss}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    var rows = [];
    for (var i = 0; i < 3; i++) {
      var row = [];
      for (var j = 0; j < 3; j++) {
        row.push(this.renderSquare(i*3+j));
      }
      rows.push(<div key={i} className="board-row">{row}</div>);
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        clickIndex: -1,
      }],
      stepNumber: 0,
      xIsNext: true,
      reverse: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).win || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        clickIndex: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  sort() {
    this.setState({
      reverse: !this.state.reverse,
    })
  }

  render() {
    const history = this.state.history;
    const descHistory = history.slice();
    if (this.state.reverse) {
      descHistory.reverse();
    }
    const current = history[this.state.stepNumber];
    const result = calculateWinner(current.squares);
    const winner = result.win;
    const winLine = result.line;

    const moves = descHistory.map((step, move) => {
      const desc = step.clickIndex >= 0 ?
        'Move #(' + (Math.floor(step.clickIndex / 3) + 1) + ', ' + (Math.floor(step.clickIndex % 3) + 1) + ')':
        'Game start';
      let descCss = desc;
      if (move === this.state.stepNumber) {
        descCss = <strong>{desc}</strong>;
      }
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{descCss}</a>
        </li>
      );
    });
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winLine={winLine}
          />
        </div>
        <div className="game-info">
          <button onClick={() => this.sort()}>sort</button>
          <div>{status}</div>
          <ol>{moves}</ol>
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

function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {win: squares[a], line: [a, b, c]};
    }
  }
  return {win: null, line: []};
}