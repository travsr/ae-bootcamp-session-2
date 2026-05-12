import React, { useState, useEffect } from 'react';

function SudokuBoard({ puzzle, solution, onComplete }) {
  const [userGrid, setUserGrid] = useState(() => puzzle.map(row => [...row]));

  useEffect(() => {
    setUserGrid(puzzle.map(row => [...row]));
  }, [puzzle]);

  function handleChange(row, col, value) {
    if (value !== '' && !/^[1-9]$/.test(value)) return;

    const digit = value === '' ? 0 : parseInt(value, 10);
    const newGrid = userGrid.map(r => [...r]);
    newGrid[row][col] = digit;
    setUserGrid(newGrid);

    const isComplete = newGrid.every((r, ri) =>
      r.every((cell, ci) => cell === solution[ri][ci])
    );
    if (isComplete) onComplete();
  }

  function getCellStyle(row, col) {
    const style = {};
    if (col === 2 || col === 5) {
      style.borderRight = '2px solid #282c34';
    }
    if (row === 2 || row === 5) {
      style.borderBottom = '2px solid #282c34';
    }
    return style;
  }

  return (
    <div className="sudoku-board">
      {puzzle.map((rowData, row) =>
        rowData.map((cell, col) => {
          const isClue = cell !== 0;
          const userValue = userGrid[row][col];
          const displayValue = isClue ? cell : (userValue !== 0 ? userValue : '');
          const isError = !isClue && userValue !== 0 && userValue !== solution[row][col];

          const className = [
            'sudoku-cell',
            isClue ? 'sudoku-cell--clue' : '',
            isError ? 'sudoku-cell--error' : '',
          ].filter(Boolean).join(' ');

          return (
            <input
              key={`${row}-${col}`}
              className={className}
              style={getCellStyle(row, col)}
              type="text"
              value={displayValue}
              readOnly={isClue}
              onChange={isClue ? undefined : (e) => handleChange(row, col, e.target.value)}
            />
          );
        })
      )}
    </div>
  );
}

export default SudokuBoard;
