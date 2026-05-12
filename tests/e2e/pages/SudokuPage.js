const { expect } = require('@playwright/test');

class SudokuPage {
  constructor(page) {
    this.page = page;
    this.difficultySelector = page.locator('.difficulty-selector');
    this.easyButton = page.locator('.difficulty-selector button', { hasText: 'Easy' });
    this.mediumButton = page.locator('.difficulty-selector button', { hasText: 'Medium' });
    this.hardButton = page.locator('.difficulty-selector button', { hasText: 'Hard' });
    this.board = page.locator('.sudoku-board');
    this.loadingIndicator = page.locator('.loading');
    this.successMessage = page.locator('.success-message');
    this.playAgainButton = page.locator('.play-again');
  }

  async goto() {
    await this.page.goto('/');
  }

  async selectDifficulty(difficulty) {
    const buttons = {
      easy: this.easyButton,
      medium: this.mediumButton,
      hard: this.hardButton,
    };
    const button = buttons[difficulty.toLowerCase()];
    if (!button) throw new Error(`Unknown difficulty: ${difficulty}`);
    await button.click();
  }

  async waitForBoard() {
    await expect(this.board).toBeVisible();
  }

  async waitForSuccess() {
    await expect(this.successMessage).toBeVisible();
  }

  getBoardCells() {
    return this.page.locator('.sudoku-cell');
  }

  getClueCells() {
    return this.page.locator('.sudoku-cell--clue');
  }

  getEditableCells() {
    return this.page.locator('.sudoku-cell:not(.sudoku-cell--clue)');
  }

  getCell(row, col) {
    // Cells are rendered as a flat list, row-major order (9 cols per row)
    return this.page.locator('.sudoku-cell').nth(row * 9 + col);
  }
}

module.exports = { SudokuPage };
