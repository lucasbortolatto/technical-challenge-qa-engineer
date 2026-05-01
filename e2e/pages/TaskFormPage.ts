import { Page, Locator } from '@playwright/test';

export class TaskFormPage {
  readonly page: Page;

  readonly titleInput: Locator;
  readonly submitButton: Locator;
  readonly taskForm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByTestId('task-title-input');
    this.submitButton = page.getByTestId('task-submit-button');
    this.taskForm = page.getByTestId('task-form');
  }

  async createTask(title: string) {
    await this.titleInput.fill(title);
    // Registra o listener antes do click para não perder respostas rápidas
    const responsePromise = this.page.waitForResponse((res) =>
      res.url().includes('/tasks') && res.request().method() === 'POST'
    );
    await this.submitButton.click();
    await responsePromise;
  }
}
