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
    let attempts = 1000;
    do {
      const newGame = solveSudoku(game);
      setGame(newGame);
      if (newGame.isCompleted) {
        break;
      }
      attempts--;
    } while (attempts > 0);
  };

  const lockCells = () => {
    const newBoard = { ...game.board };
    newBoard.cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.value !== null) {
          cell.isFixed = true;
        }
      });
    });
    setGame({
      ...game,
      board: newBoard,
    });
  };

  return (
    <>
      <button onClick={() => handleSolveClick()}>Solve</button>
      <button onClick={() => lockCells()}>Lock</button>
      <button onClick={() => resetGame()}>Reset</button>
      <div className="game">
        {game.board.cells.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, cellIndex) => (
              <div
                className={`cell ${
                  cell.value ? "cell--solved" : "cell--unsolved"
                }`}
              >
                {cell.value ? null : (
                  <div className="cell__options">
                    {Array.from({ length: 9 }, (_, i) => (
                      <span key={i}>
                        {cell.options.includes(i + 1) ? i + 1 : " "}
                      </span>
                    ))}
                  </div>
                )}
                <input
                  className="cell__input"
                  type="number"
                  min={1}
                  max={9}
                  key={cellIndex}
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
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
