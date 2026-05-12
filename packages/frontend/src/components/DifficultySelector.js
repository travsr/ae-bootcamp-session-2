import React from 'react';

const DIFFICULTIES = ['easy', 'medium', 'hard'];

function DifficultySelector({ onSelect, selected }) {
  return (
    <div className="difficulty-selector">
      {DIFFICULTIES.map((difficulty) => (
        <button
          key={difficulty}
          className={selected === difficulty ? 'active' : ''}
          onClick={() => onSelect(difficulty)}
        >
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default DifficultySelector;
