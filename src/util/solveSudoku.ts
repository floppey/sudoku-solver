import { Cell, Move, SudokuGame } from "../types";
import { reducePairsInGrid } from "./reducePairsInGrid";

export const getOptionsForCell = (
  game: SudokuGame,
  row: number,
  column: number
): number[] => {
  if (game.board.cells[row][column].value !== null) {
    return [];
  }
  const options = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  // Remove options from row and column that are already taken
  for (let i = 0; i < 9; i++) {
    const rowValue = game.board.cells[row][i].value;
    const columnValue = game.board.cells[i][column].value;
    if (rowValue !== null) {
      options.delete(rowValue);
    }
    if (columnValue !== null) {
      options.delete(columnValue);
    }
  }

  // Remove options from 3x3 grid that are already taken
  const gridRow = Math.floor(row / 3) * 3;
  const gridColumn = Math.floor(column / 3) * 3;
  for (let i = gridRow; i < gridRow + 3; i++) {
    for (let j = gridColumn; j < gridColumn + 3; j++) {
      const value = game.board.cells[i][j].value;
      if (value !== null) {
        options.delete(value);
      }
    }
  }

  return Array.from(options);
};

export const solveSudoku = (
  game: SudokuGame,
  allowGuess = false
): SudokuGame => {
  const newGame = {
    ...game,
  };

  let changed = false;
  let attempts = 0;
  do {
    changed = false;
    // Fill in cells with only one option
    newGame.board.cells.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell.value !== null) {
          cell.options = [cell.value];
          return;
        }
        const options = getOptionsForCell(newGame, rowIndex, columnIndex);
        if (options.length === 1) {
          changed = true;
          cell.value = options[0];
          cell.options = [options[0]];
        } else if (cell.options.length !== options.length) {
          changed = true;
          cell.options = options;
        }
      });
    });
    attempts++;
  } while (changed && attempts < 20);

  // Check for unique options in row, column, and grid
  newGame.board.cells.forEach((row) => {
    row.forEach((cell) => {
      if (cell.value !== null) {
        return;
      }
      cell.options.forEach((option) => {
        // Check row
        const rowOptions = row.filter((c) => c.options.includes(option)).length;
        const column = newGame.board.cells.map((r) => r[cell.column]);
        const columnOptions = column.filter((c) =>
          c.options.includes(option)
        ).length;
        if (rowOptions === 1) {
          cell.value = option;
          return;
        }
        if (columnOptions === 1) {
          cell.value = option;
          return;
        }
      });
    });
  });

  let temp = false;
  attempts = 0;
  do {
    temp = false;
    for (let row = 0; row < 9; row += 3) {
      for (let col = 0; col < 9; col += 3) {
        temp = reducePairsInGrid(newGame.board, row, col) || changed;
      }
    }
    changed = changed || temp;
    attempts++;
  } while (temp && attempts < 10);

  // Fill in cells with only one option
  newGame.board.cells.forEach((row) => {
    row.forEach((cell) => {
      if (cell.value !== null) {
        return;
      }
      if (cell.options.length === 1) {
        cell.value = cell.options[0];
        changed = true;
      }
    });
  });

  // Check if the game is completed
  newGame.isCompleted = newGame.board.cells.every((row) =>
    row.every((cell) => cell.value !== null)
  );

  // Return if the game is completed
  if (newGame.isCompleted) {
    return newGame;
  }

  // Use WFC to make a guess
  if (!changed && allowGuess) {
    let minOptions = 999;
    let minCells: Cell[] = [];
    newGame.board.cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.value !== null) return;
        if (cell.options.length < minOptions) {
          minCells = [];
          minOptions = cell.options.length;
        }
        if (cell.options.length === minOptions) {
          minCells.push(cell);
        }
      });
    });

    // If there are no options, the game is unsolvable. Revert to a previous state
    if (minOptions === 0) {
      return newGame.moves[Math.floor(Math.random() * newGame.moves.length)]
        .previousState;
    }

    // Pick a random cell and value
    const cell = minCells[Math.floor(Math.random() * minCells.length)];
    const value = cell.options[Math.floor(Math.random() * cell.options.length)];
    // Record the move so it can be undone later if it leads to an unsolvable state
    const move: Move = {
      row: cell.row,
      column: cell.column,
      value: value,
      previousState: {
        ...newGame,
        board: {
          cells: newGame.board.cells.map((row) =>
            row.map((cell) => ({ ...cell, isFixed: cell.isFixed }))
          ),
        },
      },
    };
    game.moves.push(move);

    // Make the guess
    cell.value = value;
    cell.options = [value];
  }

  return newGame;
};
