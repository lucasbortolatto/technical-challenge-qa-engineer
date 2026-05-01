import { test, expect, clearAllTasks } from '../fixtures/tasks.fixture';

test.describe('Exclusão de Tarefas', () => {
  test.beforeEach(async () => {
    await clearAllTasks();
  });

  test('[E2E-0010][RF-04] deve excluir uma tarefa e removê-la da lista', async ({ taskListPage, taskFormPage }) => {
    await taskFormPage.createTask('Tarefa para excluir');
    expect(await taskListPage.getTaskCount()).toBe(1);

    await taskListPage.deleteTask('Tarefa para excluir');

    await expect(taskListPage.page.getByTestId('task-item')).toHaveCount(0);
  });

  test('[E2E-0011][RF-04] deve persistir a exclusão após recarregar a página', async ({ taskListPage, taskFormPage }) => {
    await taskFormPage.createTask('Tarefa que será excluída');
    await taskListPage.deleteTask('Tarefa que será excluída');
    await taskListPage.reload();

    await expect(taskListPage.page.getByTestId('task-item')).toHaveCount(0);
  });
});
