import React from 'react';
import './App.css';
import SudokuGame from './components/SudokuGame';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Bootcamp Capstone</h1>
        <p>Your project starts here</p>
      </header>

      <main>
        <SudokuGame />
      </main>
    </div>
  );
}

export default App;