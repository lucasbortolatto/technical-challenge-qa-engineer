import { Page, Locator, expect } from '@playwright/test';

export class TaskListPage {
  readonly page: Page;

  readonly taskList: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taskList = page.getByTestId('task-list');
    this.loadingIndicator = page.getByTestId('tasks-loading');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async reload() {
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  async getTaskByTitle(title: string): Promise<Locator> {
    return this.page
      .getByTestId('task-item')
      .filter({ has: this.page.getByTestId('task-title').filter({ hasText: title }) });
  }

  async toggleTask(title: string) {
    const task = await this.getTaskByTitle(title);
    await task.getByTestId('task-checkbox').click();
  }

  async deleteTask(title: string) {
    const task = await this.getTaskByTitle(title);
    // Registra o listener antes do click para não perder respostas rápidas
    const responsePromise = this.page.waitForResponse((res) =>
      res.url().includes('/tasks') && res.request().method() === 'DELETE'
    );
    await task.getByTestId('task-delete-button').click();
    await responsePromise;
  }

  async isTaskCompleted(title: string): Promise<boolean> {
    const task = await this.getTaskByTitle(title);
    return task.getByTestId('task-checkbox').isChecked();
  }

  async isTaskVisible(title: string): Promise<boolean> {
    const task = await this.getTaskByTitle(title);
    return task.isVisible();
  }

  async hasAiBadge(title: string): Promise<boolean> {
    const task = await this.getTaskByTitle(title);
    return task.getByTestId('task-ai-badge').isVisible();
  }

  async getTaskCount(): Promise<number> {
    return this.page.getByTestId('task-item').count();
  }
}
