import React, { useState, useEffect } from 'react';
import DifficultySelector from './DifficultySelector';
import SudokuBoard from './SudokuBoard';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function SudokuGame() {
  const [difficulty, setDifficulty] = useState(null);
  const [gameState, setGameState] = useState('idle');
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [gameState]);

  async function fetchPuzzle(diff) {
    setElapsed(0);
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
        <>
          <SudokuBoard puzzle={puzzle} solution={solution} onComplete={handleComplete} />
          <p className="timer">{formatTime(elapsed)}</p>
        </>
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
