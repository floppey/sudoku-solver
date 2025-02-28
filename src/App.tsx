import { useCallback, useEffect, useState } from "react";
import { SudokuGame } from "./types";
import { solveSudoku } from "./util/solveSudoku";
import { cloneGame } from "./util/cloneGame";
import { generateBoard } from "./util/generateBoard";
import { VALID_OPTIONS } from "./constants/constants";
import { cellHasValue } from "./util/cellHasValue";

function App() {
  const [boardSize, setBoardSize] = useState(9);
  const options = VALID_OPTIONS.slice(0, boardSize);
  const [game, setGame] = useState<SudokuGame>({
    board: {
      cells: generateBoard(boardSize),
    },
    isCompleted: false,
    boardSize,
    moves: [],
  });
  const [originalGame, setOriginalGame] = useState<SudokuGame | null>(null);

  const handleOnChange = (row: number, column: number, value: string) => {
    const newBoard = { ...game.board };
    let safeValue = options.includes(value) ? value : "";
    if (safeValue === "" && /[0-9]{1,2}/g.test(value)) {
      const index = parseInt(value, 10) - 1;
      safeValue = options[index] ?? "";
    }

    newBoard.cells[row][column].value = safeValue;
    setGame({
      ...game,
      board: newBoard,
    });
    setOriginalGame(cloneGame(game));
  };

  const resetGame = useCallback(() => {
    setGame({
      board: {
        cells: generateBoard(boardSize),
      },
      isCompleted: false,
      moves: [],
      boardSize,
    });
    setOriginalGame(null);
  }, [boardSize]);

  const handleSolveClick = () => {
    let attempts = boardSize === 16 ? 100 : 1000;
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

  const handleBoardSizeChange = (size: string) => {
    setBoardSize(parseInt(size, 10));
  };

  useEffect(() => {
    resetGame();
  }, [boardSize, resetGame]);

  return (
    <div className="app">
      <div className="buttons">
        <button onClick={() => handleSolveClick()}>Solve All</button>
        <button onClick={() => handleSolveNextClick()}>Solve Next</button>
        <button onClick={() => resetGame()}>Reset</button>
        <select
          value={boardSize}
          onChange={(e) => handleBoardSizeChange(e.target.value)}
        >
          <option value="4">4x4</option>
          <option value="9">9x9</option>
          <option value="16">16x16</option>
        </select>
      </div>
      <div
        className={`game ${
          game.isCompleted ? "game--completed" : ""
        } game--${boardSize}`}
      >
        {game.board.cells.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, cellIndex) => (
              <div
                className={`cell ${
                  cellHasValue(cell) ? "cell--solved" : "cell--unsolved"
                }`}
              >
                {cellHasValue(cell) ? null : (
                  <div className="cell__options">
                    {options.map((o) => (
                      <span key={o}>{cell.options.includes(o) ? o : " "}</span>
                    ))}
                  </div>
                )}
                <input
                  className="cell__input"
                  key={cellIndex}
                  value={cellHasValue(cell) ? cell.value : ""}
                  onClick={(e) => e.currentTarget.select()}
                  onChange={(e) =>
                    handleOnChange(
                      rowIndex,
                      cellIndex,
                      e.target.value?.toUpperCase() ?? ""
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
