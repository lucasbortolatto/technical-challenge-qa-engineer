import { test, expect, clearAllTasks } from '../fixtures';

test.describe('Gerenciamento de Tarefas', () => {
  test.beforeEach(async () => {
    await clearAllTasks();
  });

  test('[E2E-0001][RF-01] deve exibir na lista tarefas previamente cadastradas via API', async ({ taskPage, request }) => {
    // Cria tarefas diretamente via API para isolar o comportamento de listagem
    await request.post('http://localhost:3001/tasks', { data: { title: 'Tarefa Alpha' } });
    await request.post('http://localhost:3001/tasks', { data: { title: 'Tarefa Beta' } });

    await taskPage.reload();

    await expect(taskPage.page.getByTestId('task-item')).toHaveCount(2);
    await expect(taskPage.page.getByText('Tarefa Alpha')).toBeVisible();
    await expect(taskPage.page.getByText('Tarefa Beta')).toBeVisible();
  });

  test('[E2E-0002][RF-01] deve exibir múltiplas tarefas na lista', async ({ taskPage }) => {
    await taskPage.createTask('Tarefa A');
    await taskPage.createTask('Tarefa B');
    await taskPage.createTask('Tarefa C');

    await expect(taskPage.page.getByTestId('task-item')).toHaveCount(3);
  });

  test('[E2E-0003][RF-02] deve criar uma tarefa e exibi-la na lista', async ({ taskPage }) => {
    await taskPage.createTask('Minha primeira tarefa');

    await expect(taskPage.page.getByTestId('task-item')).toHaveCount(1);
    await expect(taskPage.page.getByTestId('task-title').first()).toHaveText('Minha primeira tarefa');
  });

  test('[E2E-0004][RF-02] deve persistir a tarefa criada após recarregar a página', async ({ taskPage }) => {
    await taskPage.createTask('Tarefa persistente');
    await taskPage.reload();

    expect(await taskPage.isTaskVisible('Tarefa persistente')).toBe(true);
  });

  test('[E2E-0005][RF-02] não deve criar tarefa com título vazio — sem feedback ao usuário', async ({ taskPage }) => {
    const countBefore = await taskPage.getTaskCount();

    await taskPage.submitButton.click();

    const countAfter = await taskPage.getTaskCount();
    expect(countAfter).toBe(countBefore);
  });

  test('[E2E-0006][RF-02] deve limpar o campo de título após criação bem-sucedida', async ({ taskPage }) => {
    await taskPage.createTask('Tarefa teste');
    await expect(taskPage.titleInput).toHaveValue('');
  });

  test('[E2E-0007][RF-03][RF-01] deve marcar tarefa como concluída e verificar estado visual', async ({ taskPage }) => {
    await taskPage.createTask('Tarefa para concluir');
    await taskPage.toggleTask('Tarefa para concluir');

    expect(await taskPage.isTaskCompleted('Tarefa para concluir')).toBe(true);

    const task = await taskPage.getTaskByTitle('Tarefa para concluir');
    await expect(task.getByTestId('task-title')).toHaveCSS('text-decoration-line', 'line-through');
  });

  // BUG-001: estado de conclusão não persiste após reload — aguardando correção no backend
  test('[E2E-0008][RF-03][BUG-001] marcar como concluída deve persistir após reload', async ({ taskPage }) => {
    test.fixme(true, 'BUG-001: estado volta para false após reload. Remover este fixme quando corrigido.');

    await taskPage.createTask('Tarefa com bug de persistência');
    await taskPage.toggleTask('Tarefa com bug de persistência');

    expect(await taskPage.isTaskCompleted('Tarefa com bug de persistência')).toBe(true);

    await taskPage.reload();

    expect(await taskPage.isTaskCompleted('Tarefa com bug de persistência')).toBe(true);
  });

  test('[E2E-0009][RF-03] deve permitir desmarcar uma tarefa já concluída (toggle reverso)', async ({ taskPage }) => {
    await taskPage.createTask('Tarefa toggle');

    // Marca como concluída
    await taskPage.toggleTask('Tarefa toggle');
    expect(await taskPage.isTaskCompleted('Tarefa toggle')).toBe(true);

    // Desmarca — volta ao estado pendente
    await taskPage.toggleTask('Tarefa toggle');
    expect(await taskPage.isTaskCompleted('Tarefa toggle')).toBe(false);

    const task = await taskPage.getTaskByTitle('Tarefa toggle');
    await expect(task.getByTestId('task-title')).not.toHaveCSS('text-decoration-line', 'line-through');
  });

  test('[E2E-0010][RF-04] deve excluir uma tarefa e removê-la da lista', async ({ taskPage }) => {
    await taskPage.createTask('Tarefa para excluir');
    expect(await taskPage.getTaskCount()).toBe(1);

    await taskPage.deleteTask('Tarefa para excluir');

    await expect(taskPage.page.getByTestId('task-item')).toHaveCount(0);
  });

  test('[E2E-0011][RF-04] deve persistir a exclusão após recarregar a página', async ({ taskPage }) => {
    await taskPage.createTask('Tarefa que será excluída');
    await taskPage.deleteTask('Tarefa que será excluída');
    await taskPage.reload();

    await expect(taskPage.page.getByTestId('task-item')).toHaveCount(0);
  });

  test('[E2E-0018][RF-01] deve exibir lista vazia quando não há tarefas', async ({ taskPage }) => {
    // beforeEach garante que não há tarefas — valida o estado inicial da UI
    await expect(taskPage.page.getByTestId('task-item')).toHaveCount(0);
  });

  test('[E2E-0019][RF-02] não deve adicionar tarefa à lista quando a API retorna erro', async ({ taskPage }) => {
    // Simula falha no servidor via page.route() — valida que a UI não exibe tarefa não persistida
    await taskPage.page.route('**/tasks', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 500, body: 'Internal Server Error' });
      } else {
        await route.continue();
      }
    });

    const countBefore = await taskPage.getTaskCount();

    await taskPage.titleInput.fill('Tarefa que vai falhar');
    const responsePromise = taskPage.page.waitForResponse('**/tasks');
    await taskPage.submitButton.click();
    await responsePromise; // aguarda o 500 mockado — evita waitForTimeout fixo

    const countAfter = await taskPage.getTaskCount();
    expect(countAfter).toBe(countBefore);

    await taskPage.page.unrouteAll({ behavior: 'ignoreErrors' });
  });
});
