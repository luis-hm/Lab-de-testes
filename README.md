# Swag Labs — Testes de Caixa Preta (V&V de Software)

Parte final do trabalho de **Verificação e Validação de Software** (UFC · Profa. Dra. Jacilane Rabelo): aplicar as técnicas de caixa preta (**classes de equivalência**, **valor-limite** e **grafo de causa e efeito**) às user stories da Parte 1 e **automatizar** os casos de teste com **Cypress**.

- **Sistema testado:** https://www.saucedemo.com (usuário `standard_user` / senha `secret_sauce`)
- **Entrega:** 18/11/2026 (relatório + apresentação presencial)

## Metas do grupo (6 pessoas)

| Regra | Mínimo |
|---|---|
| Casos de teste no total | **30** |
| Por pessoa | **5** (≥ 3 manuais + ≥ 2 automatizados) |
| Automatizados no total | **12** |
| Técnicas obrigatórias | Classes de equivalência + Valor-limite (causa-efeito quando aplicável) |

A US001 (login) já vem pronta como **exemplo de referência** e **não conta** no mínimo. Cada pessoa cobre as US002–US008 conforme a divisão em [docs/02-plano-de-teste.md](docs/02-plano-de-teste.md).

## Começando (5 minutos)

Pré-requisitos: [Node.js 20+](https://nodejs.org) e Git.

```bash
git clone <url-do-repo>
cd <pasta-do-repo>
npm install                 # instala Cypress + gerador de relatório
npx cypress run --spec cypress/e2e/00-smoke.cy.js   # confere se seu ambiente funciona
```

Se o smoke passar (3 ✓), está tudo pronto. Depois leia o **[CONTRIBUTING.md](CONTRIBUTING.md)** — é o passo a passo para criar seus casos de teste.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run cy:open` | Abre o Cypress interativo (bom para escrever/debugar testes) |
| `npm test` | Roda **todos** os testes headless + gera relatório e vídeos |
| `npm test -- --spec cypress/e2e/US003*` | Roda só os testes de uma US |
| `npm run test:chrome` | Roda no Chrome em vez do Electron |

Depois de `npm test`, abra **`cypress/reports/index.html`** — relatório HTML com resultado de cada teste, prints de falha e vídeos. Use como evidência no relatório final.

## Estrutura

```
├── cypress/
│   ├── e2e/                  # specs — um arquivo por US: USxxx-nome.cy.js
│   │   ├── 00-smoke.cy.js    # verificação do ambiente (não conta como CT)
│   │   └── US001-login.cy.js # EXEMPLO de referência
│   ├── pages/                # Page Objects — seletores e ações de cada tela
│   ├── fixtures/             # massa de dados (usuários, produtos)
│   └── support/commands.js   # cy.login() com sessão em cache, cy.getByData()
├── docs/
│   ├── 01-especificacao-parte1.md   # Parte 1: US001–US008 (fonte da verdade)
│   ├── 02-plano-de-teste.md         # recursos, pessoas, divisão, cronograma
│   ├── 03-casos-de-teste/           # um .md por US: técnicas + CTs + execução
│   ├── 04-incidentes.md             # defeitos encontrados
│   └── 05-relatorio-final.md        # resumo, percentuais, conclusões
└── .github/workflows/cypress.yml    # roda os testes a cada push/PR
```

**Arquitetura:** Page Object Model (seletores centralizados em `cypress/pages`, specs só descrevem o comportamento), seletores estáveis via `data-test`, login por `cy.session` (rápido e isolado), testes data-driven a partir das tabelas de valor-limite, relatório Mochawesome e CI no GitHub Actions. A rastreabilidade é **US → Cenário (CE) → Caso de Teste (CT) → `it()` no Cypress**, pelo ID `CT-USxxx-NN`.

## Problemas comuns

- **`bad option: --no-sandbox` / Cypress não abre** (geralmente no terminal do VS Code/WSL): a variável `ELECTRON_RUN_AS_NODE` está setada. Rode `unset ELECTRON_RUN_AS_NODE` (Linux/WSL) ou `set ELECTRON_RUN_AS_NODE=` (Windows cmd) antes.
- **WSL sem interface gráfica:** `npm test` (headless) funciona; para `cy:open` use o Node/Cypress instalado no Windows.
- **Teste falha com 404 no `cy.visit`:** não deveria — o `cy.visit` já ignora o status 404 que o site retorna em rotas internas (ver `cypress/support/commands.js`).
