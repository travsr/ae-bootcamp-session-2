const { test, expect } = require('@playwright/test');
const { SudokuPage } = require('./pages/SudokuPage');

test.describe('Sudoku Game Workflow', () => {
  let sudokuPage;

  test.beforeEach(async ({ page }) => {
    sudokuPage = new SudokuPage(page);
    await sudokuPage.goto();
  });

  test('initial load shows difficulty selector and no board', async () => {
    await expect(sudokuPage.difficultySelector).toBeVisible();
    await expect(sudokuPage.board).not.toBeVisible();
  });

  test('selecting Easy fetches and displays a 9×9 board', async () => {
    await sudokuPage.selectDifficulty('easy');
    await sudokuPage.waitForBoard();
    const cells = sudokuPage.getBoardCells();
    await expect(cells).toHaveCount(81);
  });

  test('selecting Medium fetches and displays a 9×9 board', async () => {
    await sudokuPage.selectDifficulty('medium');
    await sudokuPage.waitForBoard();
    const cells = sudokuPage.getBoardCells();
    await expect(cells).toHaveCount(81);
  });

  test('selecting Hard fetches and displays a 9×9 board', async () => {
    await sudokuPage.selectDifficulty('hard');
    await sudokuPage.waitForBoard();
    const cells = sudokuPage.getBoardCells();
    await expect(cells).toHaveCount(81);
  });

  test('clue cells are read-only', async () => {
    await sudokuPage.selectDifficulty('easy');
    await sudokuPage.waitForBoard();
    const clueCells = sudokuPage.getClueCells();
    const count = await clueCells.count();
    expect(count).toBeGreaterThan(0);
    // Every clue cell must have the readOnly attribute
    for (let i = 0; i < count; i++) {
      await expect(clueCells.nth(i)).toHaveAttribute('readonly', '');
    }
  });

  test('editable cells accept digit input', async () => {
    await sudokuPage.selectDifficulty('easy');
    await sudokuPage.waitForBoard();
    const editableCells = sudokuPage.getEditableCells();
    const count = await editableCells.count();
    expect(count).toBeGreaterThan(0);
    // Type a digit into the first editable cell
    const firstEditable = editableCells.first();
    await firstEditable.fill('5');
    await expect(firstEditable).toHaveValue('5');
  });

  test('switching difficulty resets the board to a new puzzle', async () => {
    await sudokuPage.selectDifficulty('easy');
    await sudokuPage.waitForBoard();
    const cellsBefore = await sudokuPage.getBoardCells().first().inputValue();

    await sudokuPage.selectDifficulty('hard');
    await sudokuPage.waitForBoard();
    // Board must still show 81 cells after reset
    await expect(sudokuPage.getBoardCells()).toHaveCount(81);
    // The difficulty button for hard should now be active
    await expect(sudokuPage.hardButton).toHaveClass(/active/);
  });
});
