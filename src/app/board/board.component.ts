import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SquareValue } from '../square/square.component';

interface BoardContent {
  squares: SquareValue[];
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BoardComponent implements OnInit {

  squares: SquareValue[];
  xIsNext: boolean;
  winner: string;

  history: BoardContent[] = [];
  stepNumber = 0;

  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

  private initSquares(): null[] {
    return Array(9).fill(null);
  }

  newGame(): void {
    this.squares = this.initSquares();
    this.winner = null;
    this.xIsNext = true;
    this.history = [{ squares: this.initSquares() }];
    this.stepNumber = 0;
  }

  get currentPlayer(): SquareValue {
    return this.xIsNext ? 'X' : 'O';
  }

  makeMove(id: number): void {
    if (!this.squares[id] && !this.winner) {

      // Get a copy of specific history in timeline starting from 0 to current stepNumber
      const history = this.history.slice(0, this.stepNumber + 1); // ! TIMELINE FRAGILE: Use "slice" to create a copy and prevent mutating the original array

      // Get the present Board Content
      const current = history[history.length - 1];

      // Refer squares from the present
      const squares = current.squares.slice(); // ! TIMELINE FRAGILE: Use "slice" to create a copy and prevent mutating the past

      // Record latest move by player and add it to the squares
      squares.splice(id, 1, this.currentPlayer);

      // Display in the UI
      this.squares = squares;

      // Clear/Remove all items after an index
      this.history.length = this.stepNumber + 1; // this happens when visiting a previous timeline, and restarting from that point

      // Update stepNumber based on new timeline
      this.stepNumber = this.history.length;

      // Record latest move by plater and add it to the new timeline
      this.history.push({ squares });
      console.log(this.history);

      // Toggle between players
      this.xIsNext = !this.xIsNext;
    }

    this.winner = this.calculateWinner(this.squares);
  }

  jumpTo(step: number): void {
    this.stepNumber = step; // identify timetravel point
    this.xIsNext = (step % 2) === 0; // acknowledge who's turn in this timeline
    this.squares = this.history[this.stepNumber].squares; // display squares from this specific timeline
    this.winner = this.calculateWinner(this.squares); // acknowledge if there is a winner in this timeline
  }

  private calculateWinner(squares: SquareValue[]) {
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
        return squares[a];
      }
    }
    return null;
  }

}
