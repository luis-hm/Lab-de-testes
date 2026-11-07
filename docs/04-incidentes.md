# Registro de Incidentes

Todo CT que **falhar** (manual ou automatizado) gera um incidente aqui. O Swag Labs é um sistema de terceiros, então a coluna “correção” registra o status do reteste — não esperamos correção do desenvolvedor.

**Prioridade:** Alta (bloqueia compra/login ou valor errado) · Média (funcionalidade incorreta com contorno) · Baixa (visual/texto).
**Status:** Aberto · Pronto para testar novamente · Fechado · Não reproduzível.

## Incidentes dos testes manuais

### INC-01 — <título curto do defeito>

| ID | Status | Responsável pela identificação | Prioridade de correção | Descrição do erro | Data e nome de quem corrigiu |
|---|---|---|---|---|---|
| CT-USxxx-NN | Aberto | <nome> | Média | <o que aconteceu × o que era esperado> – ver Figura X | — |

**Passos para reproduzir:**
1. Login com `<usuário>`
2. …
3. …

**Esperado (RN0x / CE0xx):** …
**Obtido:** …
**Reprodutibilidade:** sempre / intermitente (x de y tentativas)

![Figura X — Tela do sistema demonstrando o defeito](img/INC-01.png)

## Incidentes dos testes automatizados

### INC-0N — <título curto do defeito>

| ID | Status | Responsável pela identificação | Prioridade de correção | Descrição do erro | Data e nome de quem corrigiu |
|---|---|---|---|---|---|
| CT-USxxx-NN | Aberto | <nome> | Média | <mensagem de falha do Cypress> – ver Figura X | — |

Evidência: print gerado automaticamente em `cypress/screenshots/` e vídeo em `cypress/videos/` (copie o print para `docs/img/`).
