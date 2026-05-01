import { test as base, request } from '@playwright/test';
import { TaskListPage } from '../pages/TaskListPage';
import { TaskFormPage } from '../pages/TaskFormPage';
import { AiGeneratorPage } from '../pages/AiGeneratorPage';

const API_BASE = 'http://localhost:3001';

type Fixtures = {
  taskListPage: TaskListPage;
  taskFormPage: TaskFormPage;
  aiPage: AiGeneratorPage;
};

export const test = base.extend<Fixtures>({
  taskListPage: async ({ page }, use) => {
    const taskListPage = new TaskListPage(page);
    await taskListPage.goto();
    await use(taskListPage);
  },

  taskFormPage: async ({ taskListPage }, use) => {
    const taskFormPage = new TaskFormPage(taskListPage.page);
    await use(taskFormPage);
  },

  aiPage: async ({ page }, use) => {
    const aiPage = new AiGeneratorPage(page);
    await use(aiPage);
  },
});

/**
 * Limpa todas as tarefas existentes via API antes de cada teste.
 * Usa os próprios endpoints da aplicação para garantir estado previsível.
 */
export async function clearAllTasks(): Promise<void> {
  const ctx = await request.newContext({ baseURL: API_BASE });

  const response = await ctx.get('/tasks');
  const tasks: Array<{ id: string }> = await response.json();

  await Promise.all(tasks.map((task) => ctx.delete(`/tasks/${task.id}`)));
  await ctx.dispose();
}

export { expect } from '@playwright/test';
