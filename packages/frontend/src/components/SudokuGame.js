import React, { useState } from 'react';
import DifficultySelector from './DifficultySelector';
import SudokuBoard from './SudokuBoard';

function SudokuGame() {
  const [difficulty, setDifficulty] = useState(null);
  const [gameState, setGameState] = useState('idle');
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);

  async function fetchPuzzle(diff) {
    setGameState('loading');
    setError(null);
    try {
      const response = await fetch(`/api/sudoku?difficulty=${diff}`);
      if (!response.ok) throw new Error('Request failed');
      const data = await response.json();
      setPuzzle(data.puzzle);
      setSolution(data.solution);
      setGameState('playing');
    } catch (err) {
      setError('Failed to load puzzle. Please try again.');
      setGameState('idle');
    }
  }

  function handleDifficultySelect(diff) {
    setDifficulty(diff);
    fetchPuzzle(diff);
  }

  function handleComplete() {
    setGameState('complete');
  }

  function handlePlayAgain() {
    fetchPuzzle(difficulty);
  }

  return (
    <div className="sudoku-game">
      <DifficultySelector selected={difficulty} onSelect={handleDifficultySelect} />
      {gameState === 'idle' && !error && (
        <p>Select a difficulty to start playing.</p>
      )}
      {gameState === 'loading' && (
        <p className="loading">Loading puzzle...</p>
      )}
      {error && (
        <p className="error">{error}</p>
      )}
      {gameState === 'playing' && puzzle && solution && (
        <SudokuBoard puzzle={puzzle} solution={solution} onComplete={handleComplete} />
      )}
      {gameState === 'complete' && (
        <div className="success-message">
          <p>Congratulations! You solved the puzzle!</p>
          <button className="play-again" onClick={handlePlayAgain}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default SudokuGame;
