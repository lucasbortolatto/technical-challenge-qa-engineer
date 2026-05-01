import { test, expect, clearAllTasks } from '../fixtures/tasks.fixture';

test.describe('Criação de Tarefas', () => {
  test.beforeEach(async () => {
    await clearAllTasks();
  });

  test('[E2E-0001][RF-01] deve exibir na lista tarefas previamente cadastradas via API', async ({ taskListPage, request }) => {
    // Cria tarefas diretamente via API para isolar o comportamento de listagem
    await request.post('http://localhost:3001/tasks', { data: { title: 'Tarefa Alpha' } });
    await request.post('http://localhost:3001/tasks', { data: { title: 'Tarefa Beta' } });

    await taskListPage.reload();

    await expect(taskListPage.page.getByTestId('task-item')).toHaveCount(2);
    await expect(taskListPage.page.getByText('Tarefa Alpha')).toBeVisible();
    await expect(taskListPage.page.getByText('Tarefa Beta')).toBeVisible();
  });

  test('[E2E-0002][RF-01] deve exibir múltiplas tarefas na lista', async ({ taskListPage, taskFormPage }) => {
    await taskFormPage.createTask('Tarefa A');
    await taskFormPage.createTask('Tarefa B');
    await taskFormPage.createTask('Tarefa C');

    await expect(taskListPage.page.getByTestId('task-item')).toHaveCount(3);
  });

  test('[E2E-0003][RF-02] deve criar uma tarefa e exibi-la na lista', async ({ taskListPage, taskFormPage }) => {
    await taskFormPage.createTask('Minha primeira tarefa');

    await expect(taskListPage.page.getByTestId('task-item')).toHaveCount(1);
    await expect(taskListPage.page.getByTestId('task-title').first()).toHaveText('Minha primeira tarefa');
  });

  test('[E2E-0004][RF-02] deve persistir a tarefa criada após recarregar a página', async ({ taskListPage, taskFormPage }) => {
    await taskFormPage.createTask('Tarefa persistente');
    await taskListPage.reload();

    expect(await taskListPage.isTaskVisible('Tarefa persistente')).toBe(true);
  });

  test('[E2E-0005][RF-02] não deve criar tarefa com título vazio — sem feedback ao usuário', async ({ taskListPage, taskFormPage }) => {
    const countBefore = await taskListPage.getTaskCount();

    await taskFormPage.submitButton.click();

    const countAfter = await taskListPage.getTaskCount();
    expect(countAfter).toBe(countBefore);
  });

  test('[E2E-0006][RF-02] deve limpar o campo de título após criação bem-sucedida', async ({ taskFormPage }) => {
    await taskFormPage.createTask('Tarefa teste');
    await expect(taskFormPage.titleInput).toHaveValue('');
  });
});
