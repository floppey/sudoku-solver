import { Board, Cell } from "../types";

export const reducePairsInGrid = (
  board: Board,
  gridRow: number,
  gridCol: number
): boolean => {
  let changed = false;
  const gridCells: Cell[] = [];

  // Collect all cells in the 3x3 grid
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
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
    const options = key.split(",").map(Number);
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
        for (let i = 0; i < 9; i++) {
          if (gridCol <= i && i < gridCol + 3) {
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
        for (let i = 0; i < 9; i++) {
          if (gridRow <= i && i < gridRow + 3) {
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
