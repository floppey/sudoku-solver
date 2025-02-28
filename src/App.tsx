import { useState } from "react";
import { SudokuGame } from "./types";
import { solveSudoku } from "./util/solveSudoku";
import { cloneGame } from "./util/cloneGame";
import { generateBoard } from "./util/generateBoard";
import { formatOptions } from "./util/formatOptions";

const BOARD_SIZE = 9;

function App() {
  const [game, setGame] = useState<SudokuGame>({
    board: {
      cells: generateBoard(BOARD_SIZE),
    },
    isCompleted: false,
    moves: [],
  });
  const [originalGame, setOriginalGame] = useState<SudokuGame | null>(null);

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
    setOriginalGame(cloneGame(game));
  };

  const resetGame = () => {
    setGame({
      board: {
        cells: generateBoard(BOARD_SIZE),
      },
      isCompleted: false,
      moves: [],
    });
    setOriginalGame(null);
  };

  const handleSolveClick = () => {
    let attempts = 1000;
    if (!originalGame) {
      setOriginalGame(cloneGame(game));
    }
    do {
      const newGame = solveSudoku(originalGame ?? game, true);
      setGame(newGame);
      if (newGame.isCompleted) {
        break;
      }
      attempts--;
    } while (attempts > 0);
  };

  const handleSolveNextClick = () => {
    const newGame = solveSudoku(game, false);
    setGame(newGame);
  };

  return (
    <div className="app">
      <div className="buttons">
        <button onClick={() => handleSolveClick()}>Solve All</button>
        <button onClick={() => handleSolveNextClick()}>Solve Next</button>
        <button onClick={() => resetGame()}>Reset</button>
      </div>
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
    </div>
  );
}

export default App;
