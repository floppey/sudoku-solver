export interface Cell {
  value: number | null;
  options: number[];
  isFixed: boolean;
  row: number;
  column: number;
}

export interface Board {
  cells: Cell[][];
}

export interface Move {
  row: number;
  column: number;
  value: number | null;
  previousState: SudokuGame;
}

export interface SudokuGame {
  board: Board;
  isCompleted: boolean;
  moves: Move[];
}
