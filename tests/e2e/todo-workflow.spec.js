const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./todo-page');

const BACKEND_URL = 'http://localhost:3030';

test.describe('Todo Workflow', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    // Clear all todos via the API before each test for isolation
    const todos = await page.request.get(`${BACKEND_URL}/api/todos`);
    const list = await todos.json();
    for (const todo of list) {
      await page.request.delete(`${BACKEND_URL}/api/todos/${todo.id}`);
    }

    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('1. creates a new task with all fields', async ({ page }) => {
    await todoPage.addTask({
      title: 'E2E Full Task',
      description: 'E2E description',
      priority: 'high',
      category: 'Work',
    });

    const card = todoPage.taskCardByTitle('E2E Full Task');
    await expect(card).toBeVisible();
    await expect(card).toContainText('E2E Full Task');
    await expect(card).toContainText('High');
    await expect(card).toContainText('Work');
  });

  test('2. edits an existing task inline', async ({ page }) => {
    await todoPage.addTask({ title: 'Task To Edit' });

    await todoPage.startEditTask('Task To Edit');

    const titleInput = page.locator('[aria-label="Edit task title"]');
    await titleInput.fill('Task After Edit');

    await page.click('[aria-label="Save task"]');

    await expect(todoPage.taskCardByTitle('Task After Edit')).toBeVisible();
    await expect(page.locator('text=Task To Edit')).not.toBeVisible();
  });

  test('3. marks a task as complete with strikethrough', async ({ page }) => {
    await todoPage.addTask({ title: 'Task To Complete' });

    await todoPage.toggleComplete('Task To Complete');

    const title = todoPage
      .taskCardByTitle('Task To Complete')
      .locator('text=Task To Complete')
      .first();
    await expect(title).toHaveCSS('text-decoration', /line-through/);
  });

  test('4. deletes a task', async ({ page }) => {
    await todoPage.addTask({ title: 'Task To Delete' });
    await expect(todoPage.taskCardByTitle('Task To Delete')).toBeVisible();

    await todoPage.deleteTask('Task To Delete');

    await expect(page.locator('text=Task To Delete')).not.toBeVisible();
  });

  test('5. filters tasks by priority', async ({ page }) => {
    // Seed two tasks via API with different priorities
    await page.request.post(`${BACKEND_URL}/api/todos`, {
      data: { title: 'High Priority Task', priority: 'high' },
    });
    await page.request.post(`${BACKEND_URL}/api/todos`, {
      data: { title: 'Low Priority Task', priority: 'low' },
    });

    await page.reload();
    await page.waitForSelector('[aria-label="Add new task"]');

    await expect(todoPage.taskCardByTitle('High Priority Task')).toBeVisible();
    await expect(todoPage.taskCardByTitle('Low Priority Task')).toBeVisible();

    await todoPage.filterBy({ priority: 'high' });

    await expect(todoPage.taskCardByTitle('High Priority Task')).toBeVisible();
    await expect(page.locator('text=Low Priority Task')).not.toBeVisible();
  });

  test('6. sorts tasks by due date', async ({ page }) => {
    // Seed tasks with specific due dates via API
    await page.request.post(`${BACKEND_URL}/api/todos`, {
      data: { title: 'Due Later Task', priority: 'medium', due_date: '2027-12-31' },
    });
    await page.request.post(`${BACKEND_URL}/api/todos`, {
      data: { title: 'Due Earlier Task', priority: 'medium', due_date: '2026-01-01' },
    });

    await page.reload();
    await page.waitForSelector('[aria-label="Add new task"]');

    await todoPage.sortBy('due_date');

    // After sorting by due_date, "Due Earlier Task" should appear before "Due Later Task"
    const cards = todoPage.taskCards();
    const count = await cards.count();
    expect(count).toBe(2);

    const firstTitle = await cards.nth(0).textContent();
    const secondTitle = await cards.nth(1).textContent();
    expect(firstTitle).toContain('Due Earlier Task');
    expect(secondTitle).toContain('Due Later Task');
  });
});

