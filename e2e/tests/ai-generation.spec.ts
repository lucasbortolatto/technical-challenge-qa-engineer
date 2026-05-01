import { test, expect, clearAllTasks } from '../fixtures/tasks.fixture';

const INVALID_API_KEY = 'sk-invalid-key-for-testing';

test.describe('Geração de Tarefas via IA', () => {
  test.beforeEach(async ({ taskListPage }) => {
    await clearAllTasks();
    await taskListPage.goto();
  });

  test('[E2E-0012][RF-05] deve salvar automaticamente as subtarefas geradas na lista', async ({ taskListPage, aiPage }) => {
    // Valida o critério principal do RF-05: subtarefas geradas aparecem na lista do usuário
    const apiKey = process.env.OPENROUTER_API_KEY;
    test.skip(!apiKey, 'OPENROUTER_API_KEY não configurada — teste de integração real ignorado');

    const countBefore = await taskListPage.getTaskCount();

    await aiPage.generateWithKey(apiKey!, 'Criar um blog pessoal');
    const response = await aiPage.waitForGeneration();
    expect(response.status()).toBe(201); // falha rápido se o OpenRouter retornar erro

    // Aguarda a renderização das tarefas na lista (evita waitForTimeout fixo)
    await taskListPage.page.waitForFunction(
      (before) => document.querySelectorAll('[data-testid="task-item"]').length > before,
      countBefore,
      { timeout: 10000 }
    );

    const countAfter = await taskListPage.getTaskCount();
    expect(countAfter - countBefore).toBeGreaterThanOrEqual(2); // IA deve gerar ao menos 2 subtarefas
  });

  test('[E2E-0013][RF-05] deve exibir indicador de carregamento durante a geração', async ({ taskListPage, aiPage }) => {
    // Intercepta a requisição e atrasa com setTimeout nativo (não depende do ciclo de vida do Playwright)
    await taskListPage.page.route('**/ai/generate', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.abort();
    });

    await aiPage.setApiKey('sk-fake-key-loading-test');
    await aiPage.objectiveInput.fill('Criar um blog pessoal');

    // Dispara sem await para observar o estado intermediário
    aiPage.generateButton.click();

    // O texto do botão deve mudar para "Carregando..." durante o processamento
    await expect(aiPage.generateButton).toContainText('Carregando', { timeout: 2000 });

    // Limpa rotas pendentes ao finalizar o teste
    await taskListPage.page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('[E2E-0014][RF-01][RF-05] deve diferenciar visualmente tarefas IA de manuais em lista mista', async ({ taskListPage, taskFormPage, aiPage }) => {
    // Cria lista mista: 1 tarefa manual + N tarefas via IA
    // Valida que APENAS as tarefas de IA têm badge — testa o contraste, não só a existência
    const apiKey = process.env.OPENROUTER_API_KEY;
    test.skip(!apiKey, 'OPENROUTER_API_KEY não configurada — teste de integração real ignorado');

    await taskFormPage.createTask('Tarefa manual sem badge');
    const countComManual = await taskListPage.getTaskCount(); // = 1

    await aiPage.generateWithKey(apiKey!, 'Criar um blog pessoal');
    const response = await aiPage.waitForGeneration();
    expect(response.status()).toBe(201); // falha rápido se o OpenRouter retornar erro

    // Aguarda a renderização das tarefas na lista (evita waitForTimeout fixo)
    await taskListPage.page.waitForFunction(
      (before) => document.querySelectorAll('[data-testid="task-item"]').length > before,
      countComManual,
      { timeout: 10000 }
    );

    const totalTasks = await taskListPage.getTaskCount();
    expect(totalTasks).toBeGreaterThan(countComManual);

    // Tarefa manual NÃO deve ter badge
    expect(await taskListPage.hasAiBadge('Tarefa manual sem badge')).toBe(false);

    // Quantidade de badges deve ser exatamente (total - 1 manual)
    const badgeCount = await taskListPage.page.getByTestId('task-ai-badge').count();
    expect(badgeCount).toBe(totalTasks - 1);
  });

  test('[E2E-0015][RF-05] não deve gerar tarefas com objetivo vazio', async ({ taskListPage, aiPage }) => {
    const countBefore = await taskListPage.getTaskCount();

    await aiPage.generateButton.click();
    // Validação negativa: campo vazio não dispara requisição, não há condição para esperar
    await taskListPage.page.waitForTimeout(1000);

    const countAfter = await taskListPage.getTaskCount();
    expect(countAfter).toBe(countBefore);
  });

  // BUG-005: API Key inválida não exibe feedback na interface — aguardando correção
  test('[E2E-0016][RF-06][BUG-005] deve exibir erro ao usar API Key inválida', async ({ taskListPage, aiPage }) => {
    test.fixme(true, 'BUG-005: interface não exibe feedback para API Key inválida. Remover este fixme quando corrigido.');

    await aiPage.generateWithKey(INVALID_API_KEY, 'Lançar um produto de software');
    await taskListPage.page.waitForTimeout(3000);

    const errorVisible = await taskListPage.page.getByText(/inválid|erro|falhou/i).isVisible();
    expect(errorVisible).toBe(true);
  });

  // BUG-004: Sem API Key, nenhum feedback é exibido ao usuário — aguardando correção
  test('[E2E-0017][RF-06][BUG-004] deve exibir mensagem de erro ao gerar sem API Key configurada', async ({
    taskListPage,
    aiPage,
  }) => {
    test.fixme(true, 'BUG-004: interface não exibe feedback quando API Key não está configurada. Remover este fixme quando corrigido.');

    await aiPage.generate('Lançar um produto de software');
    await taskListPage.page.waitForTimeout(2000);

    const errorVisible = await taskListPage.page.getByText(/api key|chave|erro/i).isVisible();
    expect(errorVisible).toBe(true);
  });
});
