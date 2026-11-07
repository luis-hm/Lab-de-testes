# Instalação e uso do ambiente

Funciona em Windows, macOS e Linux. Só precisa de **Node.js** e **Git**.

## 1. Instalar o que falta (uma vez)

| | Windows | macOS | Linux (Ubuntu) |
|---|---|---|---|
| **Node.js 20+** (LTS) | Baixe o instalador em https://nodejs.org (botão LTS) e clique em *Next* até o fim | https://nodejs.org (instalador .pkg) ou `brew install node` | `sudo apt install nodejs npm` ou [nvm](https://github.com/nvm-sh/nvm) |
| **Git** | https://git-scm.com/download/win | Já vem instalado (ou `xcode-select --install`) | `sudo apt install git` |

Confira no terminal (no Windows, **PowerShell** ou **Git Bash**):

```bash
node -v   # v20 ou maior
git --version
```

## 2. Baixar o projeto e instalar as dependências

```bash
git clone <url-do-repo>
cd <pasta-do-repo>
npm install
```

O `npm install` baixa o Cypress (~500 MB na primeira vez, pode demorar alguns minutos).

## 3. Conferir se está funcionando

```bash
npx cypress run --spec cypress/e2e/00-smoke.cy.js
```

Deve terminar com **3 passing** / `All specs passed!`. Se passou, seu ambiente está pronto.

## 4. Usar no dia a dia

| Quero… | Comando |
|---|---|
| Abrir o Cypress com interface (ver o navegador executando, escolher o teste) | `npm run cy:open` → *E2E Testing* → *Electron* → clique no spec |
| Rodar todos os testes | `npm test` |
| Rodar só os testes da minha US | `npm test -- --spec "cypress/e2e/US003*"` |
| Rodar no Chrome | `npm run test:chrome` |

**Evidências para o relatório:**
- Vídeo de cada spec: `cypress/videos/`
- Print automático de cada teste que falhou: `cypress/screenshots/`
- Resumo (quantos passaram/falharam): fim da saída do `npm test` no terminal

Para escrever seus testes, siga o [padrão de escrita](../CONTRIBUTING.md).

## 5. Problemas comuns

| Sintoma | Solução |
|---|---|
| `node` / `npm` não reconhecido | Feche e abra o terminal depois de instalar o Node. No Windows, reinicie o PC se persistir. |
| `npm install` trava ou falha no download do Cypress | Rede da faculdade/proxy bloqueando: tente em outra rede (ex.: 4G) e rode `npx cypress install`. |
| `bad option: --no-sandbox` / Cypress não abre (terminal do VS Code, WSL) | Rode `unset ELECTRON_RUN_AS_NODE` (Linux/WSL/Git Bash) ou `$env:ELECTRON_RUN_AS_NODE=$null` (PowerShell) e tente de novo. |
| No WSL o `cy:open` não abre janela | Use o `npm test` (sem interface) no WSL, ou instale o Node no Windows e rode por lá. |
| Teste falha por *timeout* às vezes | O site é externo; rode de novo. Se repetir sempre, é falha real → registre em [04-incidentes.md](04-incidentes.md). |
