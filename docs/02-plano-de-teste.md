# Plano de Teste de Caixa Preta

## 1. Recursos

### 1.1 Ambiente de testes

| ID | Recurso | Finalidade | Nível de uso |
|---|---|---|---|
| **M1** | Máquina de cada integrante (Windows, Linux ou macOS) com Node.js 20+, Git e navegador Chrome | Executar testes manuais e escrever/rodar os testes automatizados | Manual + automatizado |
| **M2** | Cypress 15.21 (instalado via `npm install`) | Automação dos casos de teste, com vídeos e prints como evidência | Automatizado |
| **M3** | GitHub (repositório) | Versionamento e compartilhamento dos testes e da documentação | Manual + automatizado |
| **S1** | Swag Labs — https://www.saucedemo.com (servidor público da Sauce Labs) | Sistema sob teste; não requer instalação | Manual + automatizado |

**Massa de dados:** usuários públicos do Swag Labs (`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`, senha `secret_sauce`) e os 6 produtos do catálogo — ver `cypress/fixtures/`.

### 1.2 Pessoas envolvidas

| Nome | Função no Projeto | Ambiente |
|---|---|---|
| Arthur Gomes Menezes | Analista de testes e testador | M1, M2, M3 |
| João Fenelon Ramos Soares | Analista de testes e testador | M1, M2, M3 |
| Leticia De Oliveira Da Silva | Analista de testes e testador | M1, M2, M3 |
| Luis Felipe Holanda Martins | Analista de testes, testador e responsável pelo ambiente de automação | M1, M2, M3 |
| Ricardo Alves Da Silva | Analista de testes e testador | M1, M2, M3 |
| Samira Kelvia Oliveira De Sousa | Analista de testes e testador | M1, M2, M3 |

### 1.3 Responsabilidades

> Cada integrante: **≥ 3 CTs manuais + ≥ 2 CTs automatizados** (≥ 5 no total). Grupo: **≥ 30 CTs**, **≥ 12 automatizados**. Preencha sua linha ao escolher a US.

| Nome | US atribuída | CTs manuais | CTs automatizados | Cronograma |
|---|---|---|---|---|
| Arthur Gomes Menezes | | | | 09/11 a 16/11 |
| João Fenelon Ramos Soares | | | | 09/11 a 16/11 |
| Leticia De Oliveira Da Silva | | | | 09/11 a 16/11 |
| Luis Felipe Holanda Martins | US005 – Finalizar compra | CT-US005-03, 04, 05 | CT-US005-01, 02 | 07/11 (concluído) |
| Ricardo Alves Da Silva | | | | 09/11 a 16/11 |
| Samira Kelvia Oliveira De Sousa | | | | 09/11 a 16/11 |

### 1.4 Cronograma

| Período | Atividade | Entregável |
|---|---|---|
| 07/11 – 09/11 | Preparar ambiente (`npm install` + smoke), escolher US | Smoke passando em todas as máquinas; tabela 1.3 preenchida |
| 09/11 – 11/11 | Aplicar as técnicas e projetar os CTs | `docs/03-casos-de-teste/USxxx-*.md` com classes, limites e CTs |
| 11/11 – 13/11 | Executar os testes manuais | Tabela de execução preenchida + prints; incidentes registrados |
| 11/11 – 14/11 | Automatizar os CTs no Cypress | `cypress/e2e/USxxx-*.cy.js` no repositório |
| 15/11 – 16/11 | Rodar suíte completa, consolidar números e conclusões | vídeos/prints do Cypress; `docs/05-relatorio-final.md` |
| 17/11 | Montar e ensaiar a apresentação | Slides |
| **18/11** | **Entrega do relatório e apresentação presencial** | — |

**Local:** remoto (máquina de cada integrante) e laboratório da UFC. **Observações durante a execução:** registrar no `.md` de cada US.

## 2. Estratégia

- **Base:** user stories, regras de negócio e critérios de aceite da [Parte 1](01-especificacao-parte1.md). Comportamento diferente do especificado = defeito.
- **Técnicas obrigatórias:** particionamento em classes de equivalência e análise de valor-limite em todas as US; grafo de causa e efeito nas US com combinação de condições (ex.: US001, US005).
- **Rastreabilidade:** `USxxx` → `CExxx(USxxx)` → `CT-USxxx-NN` → `it('CT-USxxx-NN | ...')`.
- **Critério de entrada:** smoke (`00-smoke.cy.js`) passando.
- **Critério de saída:** 100% dos CTs executados, todos os defeitos registrados em [04-incidentes.md](04-incidentes.md), suíte do Cypress executada.

### 2.1 Pontos de partida por US (sugestões para aplicar as técnicas)

| US | Classes de equivalência (exemplos) | Valor-limite (exemplos) |
|---|---|---|
| US002 Ordenar | Opção de ordenação: as 4 válidas; usuário autenticado × não autenticado | Primeiro/último item de cada ordenação; produtos de mesmo preço ($15.99 — desempate) |
| US003 Adicionar | Produto fora do carrinho × já no carrinho; listagem × detalhes | Itens no carrinho: 0 (sem badge), 1, 5, **6** (todos) |
| US004 Remover | Carrinho com N itens × vazio | Remover com 2→1, **1→0** (badge some), 0 (sem botão) |
| US005 Checkout | Cada campo preenchido × vazio; carrinho com itens × vazio | Tamanho do campo 0 × 1 caractere; Item total com 1 item × 6 itens; arredondamento do Tax (8%) |
| US006 Menu | Cada opção do menu; logado × deslogado | Reset com 0, 1 e 6 itens no carrinho |
| US007 Catálogo dinâmico | Modo Lazy Load × Spinner × Slider | Slider: primeiro (dot 0) e último indicador (dot 5) |
| US008 Detalhes | `id` existente × inexistente × não numérico | `id` = −1, **0**, 1 … 4, **5**, 6 |

> Exemplo pronto para seguir: [US005-checkout.md](03-casos-de-teste/US005-checkout.md) (5 CTs, as 3 técnicas, 1 defeito encontrado). Também vale repetir os CTs com `problem_user`/`error_user`, que têm defeitos propositais.
