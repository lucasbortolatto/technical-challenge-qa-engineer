import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3001';

test.describe('Contrato de API — /tasks', () => {
  let createdTaskId: string;

  test.beforeEach(async ({ request }) => {
    // Limpa todas as tarefas antes de cada teste
    const res = await request.get(`${BASE}/tasks`);
    const tasks: Array<{ id: string }> = await res.json();
    await Promise.all(tasks.map((t) => request.delete(`${BASE}/tasks/${t.id}`)));
  });

  test('[API-0001][RF-01] GET /tasks — deve retornar lista de tarefas', async ({ request }) => {
    await request.post(`${BASE}/tasks`, { data: { title: 'Tarefa listagem' } });

    const res = await request.get(`${BASE}/tasks`);

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      isCompleted: expect.any(Boolean),
      isAiGenerated: expect.any(Boolean),
    });
  });

  test('[API-0002][RF-01] GET /tasks — deve retornar array vazio quando não há tarefas', async ({ request }) => {
    const res = await request.get(`${BASE}/tasks`);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toEqual([]);
  });

  test('[API-0003][RF-02] POST /tasks — deve criar tarefa com título válido', async ({ request }) => {
    const res = await request.post(`${BASE}/tasks`, {
      data: { title: 'Tarefa via API' },
    });

    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body).toMatchObject({
      title: 'Tarefa via API',
      isCompleted: false,
      isAiGenerated: false,
    });
    expect(body.id).toBeTruthy();

    createdTaskId = body.id;
  });

  // BUG-006: API aceita título vazio e retorna 201 — aguardando correção
  test('[API-0004][RF-02][BUG-006] POST /tasks — deve rejeitar título vazio com 400', async ({ request }) => {
    test.fixme(true, 'BUG-006: API retorna 201 para título vazio em vez de 400. Remover este fixme quando corrigido.');

    const res = await request.post(`${BASE}/tasks`, {
      data: { title: '' },
    });

    expect(res.status()).toBe(400);
  });

  test('[API-0005][RF-04] DELETE /tasks/:id — deve excluir tarefa existente', async ({ request }) => {
    const create = await request.post(`${BASE}/tasks`, { data: { title: 'Para excluir' } });
    const { id } = await create.json();

    const res = await request.delete(`${BASE}/tasks/${id}`);
    expect(res.status()).toBe(204); // 204 No Content — correto para DELETE bem-sucedido sem corpo de resposta

    const listRes = await request.get(`${BASE}/tasks`);
    const tasks: Array<{ id: string }> = await listRes.json();
    expect(tasks.find((t) => t.id === id)).toBeUndefined();
  });

  // BUG-001: endpoint de toggle não existe — aguardando implementação
  // Nota: o payload e o endpoint exato podem mudar dependendo da implementação (PATCH /tasks/:id ou similar)
  test('[API-0011][RF-03][BUG-001] PATCH /tasks/:id — deve atualizar isCompleted para true', async ({ request }) => {
    test.fixme(true, 'BUG-001: frontend não envia requisição ao backend ao toglear. Ativar quando o endpoint for implementado.');

    const create = await request.post(`${BASE}/tasks`, { data: { title: 'Tarefa para concluir' } });
    const { id } = await create.json();

    const res = await request.patch(`${BASE}/tasks/${id}`, {
      data: { isCompleted: true },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.isCompleted).toBe(true);
  });

  test('[API-0012][RF-03][BUG-001] PATCH /tasks/:id — deve atualizar isCompleted para false (toggle reverso)', async ({ request }) => {
    test.fixme(true, 'BUG-001: frontend não envia requisição ao backend ao toglear. Ativar quando o endpoint for implementado.');

    const create = await request.post(`${BASE}/tasks`, { data: { title: 'Tarefa para desmarcar' } });
    const { id } = await create.json();

    // Marca como concluída
    await request.patch(`${BASE}/tasks/${id}`, { data: { isCompleted: true } });

    // Desmarca
    const res = await request.patch(`${BASE}/tasks/${id}`, {
      data: { isCompleted: false },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.isCompleted).toBe(false);
  });

  // BUG-007: DELETE com ID inexistente retorna sucesso em vez de 404 — aguardando correção
  test('[API-0006][RF-04][BUG-007] DELETE /tasks/:id — deve retornar 404 para ID inexistente', async ({
    request,
  }) => {
    test.fixme(true, 'BUG-007: DELETE retorna 200 para ID inexistente em vez de 404. Remover este fixme quando corrigido.');

    const res = await request.delete(`${BASE}/tasks/id-que-nao-existe`);

    expect(res.status()).toBe(404);
  });
});
