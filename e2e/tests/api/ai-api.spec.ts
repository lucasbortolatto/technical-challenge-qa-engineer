import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3001';

test.describe('Contrato de API — /ai/generate', () => {
  
  test('[API-0007][RF-05] deve retornar erro ao enviar objetivo vazio', async ({ request }) => {
    const res = await request.post(`${BASE}/ai/generate`, {
      data: {
        objective: '',
        apiKey: 'sk-qualquer-chave',
      },
    });

    expect(res.status()).not.toBe(200);
    expect(res.status()).not.toBe(201);
  });

  test('[API-0008][RF-05] deve retornar array de tarefas para requisição válida', async ({ request }) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    test.skip(!apiKey, 'OPENROUTER_API_KEY não configurada — teste de integração real ignorado');

    const res = await request.post(`${BASE}/ai/generate`, {
      data: {
        objective: 'Criar um blog pessoal',
        apiKey,
      },
    });

    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toMatchObject({
      title: expect.any(String),
      isAiGenerated: true,
    });
  });

  // BUG-008: Retorna 500 em vez de 401 para API Key inválida — aguardando correção
  test('[API-0009][RF-06][BUG-008] deve retornar 401 para API Key inválida', async ({ request }) => {
    test.fixme(true, 'BUG-008: API retorna 500 para Key inválida em vez de 401. Remover este fixme quando corrigido.');

    const res = await request.post(`${BASE}/ai/generate`, {
      data: {
        objective: 'Lançar um produto',
        apiKey: 'sk-chave-invalida',
      },
    });

    expect(res.status()).toBe(401);
  });

  test('[API-0010][RF-06] deve retornar erro ao enviar sem API Key', async ({ request }) => {
    const res = await request.post(`${BASE}/ai/generate`, {
      data: {
        objective: 'Lançar um produto',
        apiKey: '',
      },
    });

    expect(res.status()).not.toBe(200);
    expect(res.status()).not.toBe(201);
  });
});
