import { test, expect, clearAllTasks } from '../fixtures/tasks.fixture';

test.describe('Conclusão de Tarefas', () => {
  test.beforeEach(async () => {
    await clearAllTasks();
  });

  test('[E2E-0007][RF-03][RF-01] deve marcar tarefa como concluída e verificar estado visual', async ({ taskListPage, taskFormPage }) => {
    await taskFormPage.createTask('Tarefa para concluir');
    await taskListPage.toggleTask('Tarefa para concluir');

    expect(await taskListPage.isTaskCompleted('Tarefa para concluir')).toBe(true);

    const task = await taskListPage.getTaskByTitle('Tarefa para concluir');
    await expect(task.getByTestId('task-title')).toHaveCSS('text-decoration-line', 'line-through');
  });

  // BUG-001: estado de conclusão não persiste após reload — aguardando correção no backend
  test('[E2E-0008][RF-03][BUG-001] marcar como concluída deve persistir após reload', async ({ taskListPage, taskFormPage }) => {
    test.fixme(true, 'BUG-001: estado volta para false após reload. Remover este fixme quando corrigido.');

    await taskFormPage.createTask('Tarefa com bug de persistência');
    await taskListPage.toggleTask('Tarefa com bug de persistência');

    expect(await taskListPage.isTaskCompleted('Tarefa com bug de persistência')).toBe(true);

    await taskListPage.reload();

    expect(await taskListPage.isTaskCompleted('Tarefa com bug de persistência')).toBe(true);
  });

  test('[E2E-0009][RF-03] deve permitir desmarcar uma tarefa já concluída (toggle reverso)', async ({ taskListPage, taskFormPage }) => {
    await taskFormPage.createTask('Tarefa toggle');

    // Marca como concluída
    await taskListPage.toggleTask('Tarefa toggle');
    expect(await taskListPage.isTaskCompleted('Tarefa toggle')).toBe(true);

    // Desmarca — volta ao estado pendente
    await taskListPage.toggleTask('Tarefa toggle');
    expect(await taskListPage.isTaskCompleted('Tarefa toggle')).toBe(false);

    const task = await taskListPage.getTaskByTitle('Tarefa toggle');
    await expect(task.getByTestId('task-title')).not.toHaveCSS('text-decoration-line', 'line-through');
  });
});
