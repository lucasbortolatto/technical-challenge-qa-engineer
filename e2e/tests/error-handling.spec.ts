import { test, expect, clearAllTasks } from '../fixtures/tasks.fixture';

test.describe('Tratamento de Erros de API', () => {
  test.beforeEach(async () => {
    await clearAllTasks();
  });

  test('[E2E-0019][RF-02] não deve adicionar tarefa à lista quando a API retorna erro', async ({ taskListPage, taskFormPage }) => {
    // Simula falha no servidor via page.route() — valida que a UI não exibe tarefa não persistida
    await taskListPage.page.route('**/tasks', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 500, body: 'Internal Server Error' });
      } else {
        await route.continue();
      }
    });

    const countBefore = await taskListPage.getTaskCount();

    await taskFormPage.titleInput.fill('Tarefa que vai falhar');
    const responsePromise = taskListPage.page.waitForResponse('**/tasks');
    await taskFormPage.submitButton.click();
    await responsePromise; // aguarda o 500 mockado — evita waitForTimeout fixo

    const countAfter = await taskListPage.getTaskCount();
    expect(countAfter).toBe(countBefore);

    await taskListPage.page.unrouteAll({ behavior: 'ignoreErrors' });
  });
});
