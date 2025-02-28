import { SudokuGame } from "../types";
import { solveSudoku } from "../util/solveSudoku";

self.onmessage = function (event) {
  try {
    let solution: SudokuGame;
    const puzzle = event.data as SudokuGame;
    let attempts = 1000;
    do {
      solution = solveSudoku(puzzle, true);
      if (solution.isCompleted) {
        break;
      }
      attempts--;
    } while (attempts > 0);

    self.postMessage(solution);
  } catch (error) {
    console.error("Worker encountered an error:", error);
    self.postMessage(null);
  }
};

self.onerror = function (error) {
  console.error("Worker script error:", error);
};
