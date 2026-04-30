# E2E Test Suite — Smart Todo App

Suite de testes automatizados com Playwright cobrindo fluxos E2E e contratos de API.

## Pré-requisitos

- Node.js 18+
- Docker e Docker Compose em execução (`docker compose up -d`)
- Aplicação acessível em `http://localhost:3000` (frontend) e `http://localhost:3001` (backend)

## Instalação

Os comandos abaixo devem ser executados **dentro do diretório `e2e/`**:

```bash
cd e2e
npm install
npx playwright install --with-deps
```

## Executar os testes

```bash
# Todos os testes (Chromium + Firefox)
npx playwright test

# Somente Chromium
npx playwright test --project=chromium

# Somente Firefox
npx playwright test --project=firefox

# Somente testes E2E (interface)
npx playwright test tests/tasks.spec.ts tests/ai-generation.spec.ts

# Somente testes de API
npx playwright test tests/api/

# Com interface visual (modo headed)
npx playwright test --headed

# Ver relatório HTML após execução
npx playwright show-report
```

## Testes que requerem API Key real

Os testes E2E-0012, E2E-0014 e API-0008 realizam chamadas reais ao OpenRouter e são ignorados automaticamente quando a chave não está configurada. Para executá-los localmente:

1. Copie o `.env.example` deste diretório para `.env`:
   ```bash
   cp .env.example .env
   ```
2. Preencha `OPENROUTER_API_KEY` com uma chave válida do OpenRouter (obtenha gratuitamente em https://openrouter.ai/keys)
3. Execute a suite normalmente — os testes ignorados serão incluídos automaticamente

Sem a chave, a suite executa sem erros e esses testes aparecem como `skipped` no relatório. Os demais testes de IA (estados de erro, loading indicator) não dependem de chave válida e sempre executam.

> **⚠️ Pendente:** ainda não foi definida a estratégia oficial para execução desses testes em ambientes compartilhados ou pipelines de CI/CD. Questões em aberto:
> - Como disponibilizar a chave de forma segura em CI (secrets, vault, variável de ambiente protegida)?
> - Os testes de integração real devem rodar em todo PR ou apenas em pipelines agendados?
> - Deve-se usar uma chave dedicada para testes (com limite de uso controlado) separada da chave de produção?
>
> Enquanto não houver definição, esses testes rodam apenas localmente mediante configuração manual do `.env`.

## Estrutura

```
e2e/
├── fixtures/
│   └── index.ts              # Setup, teardown e utilitário clearAllTasks()
├── pages/
│   ├── TaskPage.ts            # Page Object — lista e formulário de tarefas
│   └── AiGeneratorPage.ts     # Page Object — geração de tarefas via IA
├── tests/
│   ├── tasks.spec.ts          # Fluxos CRUD de tarefas
│   ├── ai-generation.spec.ts  # Fluxos de geração via IA
│   └── api/
│       ├── tasks-api.spec.ts  # Contratos REST /tasks
│       └── ai-api.spec.ts     # Contratos REST /ai/generate
├── .env.example               # Template com as variáveis necessárias
├── package.json               # Dependências e scripts npm da suite
├── playwright.config.ts       # Configuração do Playwright (projetos, browser, base URL)
└── README.md
```

> **Nota:** o arquivo `.env` não é versionado (ver `.gitignore`). Crie-o localmente a partir do `.env.example` quando precisar rodar os testes que chamam a IA de verdade.

## Sobre testes que documentam bugs

Testes comentados com `BUG-XXX` estão associados a bugs conhecidos documentados no `BUG-REPORT.md`. Esses testes assertam o **comportamento correto esperado** e estão marcados com `test.fixme()` enquanto o bug não for corrigido.

Para ativar um teste após a correção do bug: remova a linha `test.fixme(...)` correspondente. O teste passará automaticamente se a correção estiver correta — ou falhará, indicando que a implementação ainda não está de acordo com o comportamento esperado.

Isso garante rastreabilidade entre os bugs documentados e a suite, sem que testes passem por motivo errado.
