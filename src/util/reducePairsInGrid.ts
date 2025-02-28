import { Cell, SudokuGame } from "../types";

export const reducePairsInGrid = (
  game: SudokuGame,
  gridRow: number,
  gridCol: number
): boolean => {
  let changed = false;
  const gridCells: Cell[] = [];
  const { board, boardSize } = game;

  const gridSize = Math.sqrt(boardSize);
  // Collect all cells in the  grid
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      gridCells.push(board.cells[gridRow + i][gridCol + j]);
    }
  }

  // Find pairs
  const optionGroups = new Map<string, Cell[]>();
  for (const cell of gridCells) {
    if (cell.value === null) {
      const key = cell.options.sort().join(",");
      if (!optionGroups.has(key)) {
        optionGroups.set(key, []);
      }
      optionGroups.get(key)!.push(cell);
    }
  }

  // Identify unique pairs and remove their numbers from others
  for (const [key, cells] of optionGroups.entries()) {
    const options = key.split(",");
    if (cells.length === options.length) {
      for (const cell of gridCells) {
        if (cell.value === null && !cells.includes(cell)) {
          const originalLength = cell.options.length;
          cell.options = cell.options.filter((opt) => !options.includes(opt));
          if (cell.options.length !== originalLength) {
            changed = true;
          }
        }
      }

      // If cells are in the same row or column, remove options from other cells
      const row = cells[0].row;
      const col = cells[0].column;

      if (cells.every((cell) => cell.row === row)) {
        for (let i = 0; i < boardSize; i++) {
          if (gridCol <= i && i < gridCol + gridSize) {
            continue;
          }
          const cell = board.cells[row][i];
          if (cell.value === null) {
            const originalLength = cell.options.length;
            cell.options = cell.options.filter((opt) => !options.includes(opt));
            if (cell.options.length !== originalLength) {
              changed = true;
            }
          }
        }
      }

      if (cells.every((cell) => cell.column === col)) {
        for (let i = 0; i < boardSize; i++) {
          if (gridRow <= i && i < gridRow + gridSize) {
            continue;
          }
          const cell = board.cells[i][col];
          if (cell.value === null) {
            const originalLength = cell.options.length;
            cell.options = cell.options.filter((opt) => !options.includes(opt));
            if (cell.options.length !== originalLength) {
              changed = true;
            }
          }
        }
      }
    }
  }

  return changed;
};
