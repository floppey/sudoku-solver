import { SudokuGame } from "../types";

export const cloneGame = (game: SudokuGame): SudokuGame => {
  const newGame = {
    ...game,
    board: {
      cells: game.board.cells.map((row) =>
        row.map((cell) => ({
          ...cell,
          options: [...cell.options],
        }))
      ),
    },
    moves: game.moves.map((move) => ({
      ...move,
      previousState: cloneGame(move.previousState),
    })),
  };

  return newGame;
};
