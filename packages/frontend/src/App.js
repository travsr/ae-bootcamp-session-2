import React from 'react';
import './App.css';
import SudokuGame from './components/SudokuGame';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sudoku</h1>
        <p>Test your logic skills!</p>
      </header>

      <main>
        <SudokuGame />
      </main>
    </div>
  );
}

export default App;