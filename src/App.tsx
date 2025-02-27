import { useState } from "react";
import { Cell, SudokuGame } from "./types";
import { solveSudoku } from "./util/solveSudoku";

const BOARD_SIZE = 9;

const generateBoard = (): Cell[][] => {
  const cells: Cell[][] = Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, column) => ({
      value: null,
      isFixed: false,
      options: [],
      row,
      column,
    }))
  );

  /* Easy puzzle */
  // cells[0][0].value = 5;
  // cells[0][1].value = 3;
  // cells[0][4].value = 7;
  // cells[1][0].value = 6;
  // cells[1][3].value = 1;
  // cells[1][4].value = 9;
  // cells[1][5].value = 5;
  // cells[2][1].value = 9;
  // cells[2][2].value = 8;
  // cells[2][7].value = 6;
  // cells[3][0].value = 8;
  // cells[3][4].value = 6;
  // cells[3][8].value = 3;
  // cells[4][0].value = 4;
  // cells[4][3].value = 8;
  // cells[4][5].value = 3;
  // cells[4][8].value = 1;
  // cells[5][0].value = 7;
  // cells[5][4].value = 2;
  // cells[5][8].value = 6;
  // cells[6][1].value = 6;
  // cells[6][6].value = 2;
  // cells[6][7].value = 8;
  // cells[7][3].value = 4;
  // cells[7][4].value = 1;
  // cells[7][5].value = 9;
  // cells[7][8].value = 5;
  // cells[8][4].value = 8;
  // cells[8][7].value = 7;
  // cells[8][8].value = 9;

  /* Hard puzzle */
  // cells[0][0].value = 4;
  // cells[0][3].value = 8;
  // cells[0][5].value = 7;
  // cells[0][6].value = 5;
  // //
  // cells[1][4].value = 1;
  // cells[1][5].value = 9;
  // //
  // cells[2][1].value = 7;
  // cells[2][2].value = 8;
  // cells[2][3].value = 2;
  // cells[2][5].value = 3;
  // //
  // cells[3][1].value = 1;
  // cells[3][3].value = 5;
  // cells[3][6].value = 9;
  // cells[3][8].value = 2;
  // //
  // cells[4][0].value = 9;
  // cells[4][6].value = 4;
  // cells[4][8].value = 8;
  // //
  // cells[5][1].value = 4;
  // cells[5][2].value = 3;
  // cells[5][5].value = 1;
  // //
  // cells[6][2].value = 2;
  // cells[6][7].value = 8;
  // //
  // cells[8][1].value = 5;
  // cells[8][3].value = 7;
  // cells[8][7].value = 9;

  /* Expert puzzle */
  cells[0][0].value = 3;
  cells[0][2].value = 7;
  cells[0][4].value = 9;
  cells[0][8].value = 5;
  //
  cells[1][3].value = 3;
  cells[1][6].value = 6;
  cells[1][7].value = 9;
  //
  cells[2][0].value = 6;
  cells[2][5].value = 8;
  //
  cells[3][0].value = 2;
  cells[3][7].value = 1;
  //
  cells[4][0].value = 4;
  cells[4][1].value = 5;
  cells[4][7].value = 8;
  cells[4][8].value = 9;
  //
  cells[5][3].value = 7;
  cells[5][8].value = 2;
  //
  cells[6][1].value = 8;
  cells[6][4].value = 1;
  cells[6][7].value = 3;
  //
  cells[7][1].value = 2;
  //
  cells[8][3].value = 4;
  cells[8][4].value = 8;
  cells[8][6].value = 5;

  cells.forEach((row) => {
    row.forEach((cell) => {
      if (cell.value !== null) {
        cell.isFixed = true;
      }
    });
  });

  return cells;
};

const formatOptions = (options: number[]) => {
  const formattedOptions: string[] = [];
  for (let i = 0; i < 9; i++) {
    formattedOptions.push(options.includes(i + 1) ? `${i + 1}` : " ");
    if (i % 3 === 2) {
      formattedOptions.push("\n");
    }
  }
  return formattedOptions.join(" ").replace(/\n\s/g, "\n");
};

function App() {
  const [game, setGame] = useState<SudokuGame>({
    board: {
      cells: generateBoard(),
    },
    isCompleted: false,
    moves: [],
  });

  const handleOnChange = (row: number, column: number, value: number) => {
    const newBoard = { ...game.board };
    const safeValue =
      !value || isNaN(value) || typeof value !== "number"
        ? null
        : Math.max(0, Math.min(value, 9));
    newBoard.cells[row][column].value = safeValue;
    setGame({
      ...game,
      board: newBoard,
    });
  };

  const resetGame = () => {
    setGame({
      board: {
        cells: generateBoard(),
      },
      isCompleted: false,
      moves: [],
    });
  };

  const handleSolveClick = () => {
    const solvedGame = solveSudoku(game);
    setGame(solvedGame);
  };

  return (
    <>
      <button onClick={() => handleSolveClick()}>Solve</button>
      <button onClick={() => resetGame()}>Reset</button>
      <div className="game">
        {game.board.cells.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, cellIndex) => (
              <textarea
                key={cellIndex}
                className={`cell ${
                  cell.value ? "cell--solved" : "cell--unsolved"
                }`}
                value={cell.value ?? formatOptions(cell.options)}
                onClick={(e) => e.currentTarget.select()}
                onChange={(e) =>
                  handleOnChange(
                    rowIndex,
                    cellIndex,
                    parseInt(e.target.value, 10)
                  )
                }
                readOnly={cell.isFixed}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
