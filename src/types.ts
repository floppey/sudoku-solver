export interface Cell {
  value: string | null;
  options: string[];
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
  value: string | null;
  previousState: SudokuGame;
}

export interface SudokuGame {
  board: Board;
  boardSize: number;
  isCompleted: boolean;
  moves: Move[];
}
