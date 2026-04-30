# Test Strategy — Smart Todo App

## 1. Objetivo

Este documento define a estratégia de testes para a aplicação **Smart Todo App**, uma lista de tarefas com geração de subtarefas via IA.

Os objetivos de teste são:

- **Cobertura funcional:** 100% dos fluxos P1 (persistência e integração com IA) cobertos por testes E2E antes de qualquer merge na branch principal
- **Contratos de API:** todos os endpoints documentados no Swagger validados contra o comportamento real da API
- **Zero regressão crítica:** nenhum defeito de severidade Alta ou Crítica introduzido após correções, verificado pela suite de regressão automatizada
- **Tempo de feedback:** suite E2E completa executada em menos de 3 minutos em ambiente local com Docker

---

## 2. Escopo

### 2.1 Funcionalidades cobertas

| Código | Funcionalidade | Criticidade |
|--------|---------------|-------------|
| RF-01 | Gerenciamento de tarefas (criar, listar, concluir, excluir) | Alta |
| RF-02 | Geração de subtarefas via IA | Alta |
| RF-03 | Diferenciação visual entre tarefas principais e subtarefas | Média |
| RF-04 | Configuração de API Key para o serviço de IA | Alta |
| RF-05 | Persistência de dados | Alta |
| RF-06 | Documentação de API (Swagger) | Baixa |

### 2.2 Contexto técnico

A aplicação roda via Docker Compose com dois serviços: frontend em **Next.js 14** (porta 3000) e backend em **NestJS** (porta 3001). O banco de dados é **SQLite via TypeORM**, persistido em arquivo local. A integração de IA utiliza **OpenRouter** como provedor, exigindo uma API Key configurada pelo usuário. Não há ambiente de CI/CD configurado no projeto — os testes são executados localmente contra os containers Docker.

Essa stack determina a abordagem: automação E2E via Playwright (compatível com Next.js), testes de API via HTTP direto ao NestJS, e validação de persistência via queries SQLite independentes da UI.

### 2.3 Fora de escopo

- Testes de performance e carga

> **Nota:** Testes cross-browser (Chrome e Firefox) estão **dentro do escopo** conforme requisito do projeto. Testes de acessibilidade (WCAG) são considerados **bônus** e podem ser incluídos caso o tempo permita.

---

## 3. Abordagem por Funcionalidade

### RF-01 — Gerenciamento de Tarefas

O núcleo da aplicação. Os pontos críticos de teste são o ciclo completo de vida de uma tarefa: criação, exibição, mudança de estado e exclusão, com foco em verificar que cada operação persiste corretamente no banco de dados.

**Áreas de atenção:**
- Operações de escrita dependem de persistência correta no banco — área crítica em aplicações com estado gerenciado no frontend
- Ausência de contrato formal de validação entre frontend e backend aumenta a probabilidade de dados inválidos chegarem ao banco
- Entradas extremas (campos vazios, strings muito longas) tendem a não ser cobertas em implementações sem especificação explícita de limites

**Foco dos testes:** Happy path completo do CRUD + validações de entrada + persistência após reload.

---

### RF-02 — Geração de Subtarefas via IA

Funcionalidade com maior dependência externa (OpenRouter). O risco principal não está na IA em si, mas no tratamento dos estados intermediários: sem API Key configurada, com Key inválida, e com serviço indisponível.

**Áreas de atenção:**
- Integrações com serviços externos introduzem estados de erro que o frontend precisa tratar explicitamente — falhas silenciosas são comuns quando esse tratamento não é especificado
- A resposta da IA é não-determinística, exigindo validação do formato recebido antes de processar
- Dependência de configuração prévia (API Key) cria um fluxo de pré-requisito que pode não estar visível ao usuário

**Foco dos testes:** Fluxo com Key válida + todos os estados de erro (sem Key, Key inválida, timeout) + verificação de feedback visual ao usuário.

---

### RF-03 — Diferenciação Visual

Requisito de apresentação com impacto direto na usabilidade. O risco é que tarefas geradas pela IA não sejam visualmente distinguíveis das tarefas manuais.

**Áreas de atenção:**
- Atributos visuais derivados de dados do banco dependem de consistência entre o que é armazenado e o que é renderizado — divergências podem surgir após reload
- Requisitos de diferenciação visual sem critério objetivo tendem a gerar implementações inconsistentes entre sessões de desenvolvimento

**Foco dos testes:** Verificação visual após criação manual + após geração via IA + após reload da página.

---

### RF-04 — Configuração de API Key

Ponto de integração entre o frontend e o serviço de IA. A Key precisa ser configurada, validada e persistida para que RF-02 funcione.

**Áreas de atenção:**
- Dados sensíveis armazenados no cliente (localStorage, cookies) estão sujeitos a exposição — o mecanismo de armazenamento precisa ser verificado
- A ausência de validação prévia da Key desloca o erro para o momento de uso, tornando a causa menos clara para o usuário
- Persistência entre sessões é um comportamento esperado pelo usuário mas raramente especificado explicitamente

**Foco dos testes:** Configurar Key válida → gerar subtarefa + configurar Key inválida → verificar feedback + persistência da Key após reload.

---

### RF-05 — Persistência de Dados

Requisito transversal que afeta todos os outros. A aplicação usa SQLite via TypeORM. O banco em arquivo local introduz dependência de I/O que pode causar divergência entre o estado da UI e o estado real dos dados.

**Áreas de atenção:**
- Operações compostas (ex: criar tarefa principal + subtarefas geradas pela IA) sem controle transacional podem resultar em estado parcialmente salvo
- O frontend pode atualizar o estado local otimisticamente antes da confirmação do backend, mascarando falhas de persistência

**Foco dos testes:** Verificar estado do banco após cada operação crítica + comportamento após reinício do servidor.

---

### RF-06 — Documentação de API

Criticidade baixa para o usuário final, mas importante para integradores. O Swagger em `/api/docs` deve refletir fielmente os endpoints disponíveis.

**Áreas de atenção:**
- Documentação gerada automaticamente pode ficar desatualizada quando os contratos da API mudam sem atualização dos decorators

**Foco dos testes:** Verificar que todos os endpoints estão documentados e que os contratos da documentação batem com o comportamento real da API.

---
```
## 4. Pirâmide de Testes

       /\
      /E2E\          ← Fluxos críticos ponta a ponta (Playwright)
     /------\
    / Integr \       ← Contrato API + integração Frontend/Backend
   /----------\
  /  Unitários  \    ← Lógica de negócio isolada (serviços, validações)
 /--------------\

```
 ### 4.1 Testes Unitários

**Onde aplicar:** Camada de serviços do backend (NestJS).

- Lógica de criação e validação de tarefas
- Tratamento de erros do serviço de IA
- Validação dos DTOs (campos obrigatórios, tipos, limites)

**Ferramentas sugeridas:** Jest (já presente no stack NestJS)

---

### 4.2 Testes de Integração / Contrato de API

**Onde aplicar:** Endpoints REST documentados no Swagger.

Cada endpoint deve ser testado verificando: status code esperado, formato do payload de resposta, comportamento com entrada inválida e comportamento com recurso inexistente.

| Endpoint | Casos críticos |
|----------|---------------|
| `POST /tasks` | Criação válida, título vazio |
| `GET /tasks` | Lista com itens, lista vazia |
| `PATCH /tasks/:id` | Toggle `isCompleted` para true, toggle para false |
| `DELETE /tasks/:id` | Exclusão válida, ID inexistente |
| `POST /ai/generate` | Com Key válida, sem Key, Key inválida |

**Ferramentas sugeridas:** Supertest + Jest, ou Playwright (API testing mode)

---

### 4.3 Testes E2E

**Onde aplicar:** Fluxos de maior valor de negócio, testando frontend e backend juntos.

Priorizar os fluxos que o usuário final percorre com mais frequência e os que têm maior risco de regressão:

1. Criar tarefa → verificar na lista → marcar como concluída → verificar persistência após reload
2. Configurar API Key → criar tarefa → gerar subtarefas → verificar exibição
3. Criar tarefa → excluir → verificar remoção da lista e do banco
4. Tentar criar tarefa com título vazio → verificar feedback de validação
5. Gerar subtarefas sem API Key configurada → verificar mensagem de erro

**Ferramenta:** Playwright com Page Object Model

---

## 5. Análise de Riscos

| Área | Risco | Probabilidade | Impacto | Prioridade |
|------|-------|--------------|---------|-----------|
| Persistência | Operações sem commit real no banco | Alta | Crítico | P1 |
| IA / API Key | Erros silenciosos sem feedback ao usuário | Alta | Alto | P1 |
| Validação de entrada | Backend aceita dados inválidos | Alta | Alto | P2 |
| API REST | Contratos inconsistentes com a documentação | Média | Médio | P2 |
| Diferenciação visual | Tarefas sem marcação correta após reload | Média | Médio | P3 |
| Segurança | API Key exposta ou mal armazenada | Baixa | Alto | P2 |

---

## 6. Processo e Critérios de Qualidade

### 6.1 Critérios de entrada

Antes de iniciar a execução dos testes, os seguintes pré-requisitos devem estar satisfeitos:

- Containers Docker (frontend e backend) em execução e respondendo
- Banco de dados SQLite inicializado e acessível
- Estado do banco limpo antes de cada execução da suite

**Configuração da API Key para testes com integração real de IA:**

Alguns testes (E2E-0012, E2E-0014, API-0008) realizam chamadas reais ao OpenRouter e são ignorados automaticamente quando a chave não está configurada. Para executá-los:

1. Acesse o diretório `e2e/` e copie `.env.example` para `.env`: `cp .env.example .env`
2. Preencha `OPENROUTER_API_KEY` com uma chave válida do OpenRouter
3. Execute a suite normalmente — os testes ignorados serão incluídos automaticamente

Sem a chave configurada, a suite executa sem erros e esses testes aparecem como `skipped` no relatório. Testes de estados de erro (chave inválida, sem chave, loading indicator) não dependem de chave válida e sempre executam.

**Estratégia de reset de dados:** antes de cada teste E2E, todas as tarefas existentes serão removidas via chamada ao endpoint `DELETE /tasks/:id` para cada item retornado por `GET /tasks`. Essa abordagem usa a própria API da aplicação, garantindo que o comportamento de limpeza também seja validado indiretamente. A limpeza é implementada nos fixtures do Playwright como `beforeEach`, assegurando que cada teste comece com um estado previsível e independente dos demais.

### 6.2 Definição de pronto para um teste

- Cobre pelo menos o happy path e o principal caso de erro
- Isolado e reproduzível (não depende de ordem de execução)
- Falha claramente quando o comportamento quebra

### 6.3 Critérios de saída da suite E2E

- 100% dos fluxos P1 passando
- 0 falhas flaky (instáveis) na suite crítica
- Tempo total de execução abaixo de 3 minutos

### 6.4 Integração contínua

Recomenda-se executar a suite E2E a cada Pull Request que afete as camadas de serviço, API ou componentes de UI críticos. Testes unitários e de integração devem rodar em todo commit.

---

## 7. Ferramentas e Stack de Testes

| Camada | Ferramenta | Justificativa |
|--------|-----------|---------------|
| Unitário | Jest | Nativo no NestJS, sem overhead de configuração |
| Integração API | Supertest + Jest | Testa HTTP sem subir servidor real |
| E2E | Playwright | Suporte nativo a TypeScript, API testing, POM pattern |
| Banco de dados | SQLite CLI / queries diretas | Validação de persistência independente da UI |