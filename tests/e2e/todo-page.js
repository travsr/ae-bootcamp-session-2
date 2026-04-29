/**
 * Page Object Model for the Todo App.
 * Provides reusable helpers for interacting with the UI in E2E tests.
 */
class TodoPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForSelector('[aria-label="Add new task"]');
  }

  // Open the "Add Task" dialog
  async openAddDialog() {
    await this.page.click('[aria-label="Add new task"]');
    await this.page.waitForSelector('[role="dialog"]');
  }

  // Fill and submit the Add Task dialog
  async addTask({ title, description = '', priority, category, tags = [] }) {
    await this.openAddDialog();

    await this.page.fill('[aria-label="Task title"]', title);

    if (description) {
      await this.page.fill('[aria-label="Task description"]', description);
    }

    if (priority) {
      await this.page.click(`[aria-label="${capitalize(priority)}"]`);
    }

    if (category) {
      await this.page.click('[aria-label="Category"]');
      await this.page.click(`[data-value="${category}"]`);
    }

    for (const tag of tags) {
      const tagsInput = this.page.locator('[label="Tags"] input');
      await tagsInput.fill(tag);
      await tagsInput.press('Enter');
    }

    await this.page.click('[aria-label="Add task"]');
    await this.page.waitForSelector('[role="dialog"]', { state: 'detached' });
  }

  // Get all task card elements
  taskCards() {
    return this.page.locator('.MuiCard-root');
  }

  // Get a task card by its title text
  taskCardByTitle(title) {
    return this.page.locator('.MuiCard-root', { hasText: title });
  }

  // Click the delete button on a task card
  async deleteTask(title) {
    const card = this.taskCardByTitle(title);
    await card.locator('[aria-label="Delete task"]').click();
  }

  // Click the edit button on a task card
  async startEditTask(title) {
    const card = this.taskCardByTitle(title);
    await card.locator('[aria-label="Edit task"]').click();
  }

  // Toggle completion checkbox on a task card
  async toggleComplete(title) {
    const card = this.taskCardByTitle(title);
    const checkbox = card.locator('[type="checkbox"]');
    await checkbox.click();
  }

  // Set filter or sort controls
  async filterBy({ category, priority, status }) {
    if (category) {
      await this.page.click('[aria-label="Filter by category"]');
      await this.page.click(`[data-value="${category}"]`);
    }
    if (priority) {
      await this.page.click('[aria-label="Filter by priority"]');
      await this.page.click(`[data-value="${priority}"]`);
    }
    if (status !== undefined) {
      await this.page.click('[aria-label="Filter by completion status"]');
      await this.page.click(`[data-value="${status}"]`);
    }
  }

  async sortBy(value) {
    await this.page.click('[aria-label="Sort tasks"]');
    await this.page.click(`[data-value="${value}"]`);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = { TodoPage };
