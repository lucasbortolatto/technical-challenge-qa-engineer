import { test as base, request } from '@playwright/test';
import { TaskPage } from '../pages/TaskPage';
import { AiGeneratorPage } from '../pages/AiGeneratorPage';

const API_BASE = 'http://localhost:3001';

type Fixtures = {
  taskPage: TaskPage;
  aiPage: AiGeneratorPage;
};

export const test = base.extend<Fixtures>({
  taskPage: async ({ page }, use) => {
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await use(taskPage);
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
