import { test, expect, clearAllTasks } from '../fixtures/tasks.fixture';

test.describe('Estado Vazio', () => {
  test.beforeEach(async () => {
    await clearAllTasks();
  });

  test('[E2E-0018][RF-01] deve exibir lista vazia quando não há tarefas', async ({ taskListPage }) => {
    // beforeEach garante que não há tarefas — valida o estado inicial da UI
    await expect(taskListPage.page.getByTestId('task-item')).toHaveCount(0);
  });
});
