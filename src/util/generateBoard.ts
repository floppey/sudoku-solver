import { Cell } from "../types";

export const generateBoard = (boardSize: number): Cell[][] => {
  const cells: Cell[][] = Array.from({ length: boardSize }, (_, row) =>
    Array.from({ length: boardSize }, (_, column) => ({
      value: null,
      isFixed: false,
      options: [],
      row,
      column,
    }))
  );

  cells.forEach((row) => {
    row.forEach((cell) => {
      if (cell.value !== null) {
        cell.isFixed = true;
      }
    });
  });

  return cells;
};
