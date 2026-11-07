# Padrão de escrita dos casos de teste (recomendação)

Recomendação para todo mundo escrever os casos de teste do mesmo jeito. Assim fica fácil juntar tudo no relatório e rastrear cada CT até a técnica que o gerou.

## 1. ID e nome dos arquivos

- **ID do caso de teste:** `CT-USxxx-NN` → ex.: `CT-US003-01`, `CT-US003-02`.
- **Documentação:** `docs/03-casos-de-teste/USxxx-nome-curto.md` (copie o [_TEMPLATE.md](docs/03-casos-de-teste/_TEMPLATE.md)).
- **Automação:** `cypress/e2e/USxxx-nome-curto.cy.js` (mesmo nome do `.md`).

## 2. Ordem de escrita

1. Leia a US em [docs/01-especificacao-parte1.md](docs/01-especificacao-parte1.md) (RNs, cenários e critérios de aceite).
2. **Classes de equivalência:** condições de entrada → classes válidas (`CV1`, `CV2`…) e inválidas (`CI1`, `CI2`…).
3. **Valor-limite:** para cada limite, teste limite −1, limite e limite +1.
4. **Causa e efeito** (quando houver combinação de condições): causas, efeitos e tabela de decisão (`R1`, `R2`…).
5. **Casos de teste:** cada CT diz o que cobre (ex.: `CI2, VL, RN03`) e se é **Manual** ou **Automatizado**.

Mínimo por pessoa: **3 manuais + 2 automatizados**.

**Exemplo real para copiar:** [US005-checkout.md](docs/03-casos-de-teste/US005-checkout.md) + [US005-checkout.cy.js](cypress/e2e/US005-checkout.cy.js) — 5 CTs (3 manuais + 2 automatizados), as três técnicas, tabela de decisão automatizada data-driven e um defeito registrado em [04-incidentes.md](docs/04-incidentes.md).

## 3. Como escrever um caso de teste

| Campo | Como preencher | Exemplo |
|---|---|---|
| ID | `CT-USxxx-NN` | CT-US005-02 |
| Tipo | Manual / Automatizado | Automatizado |
| Descrição | Verbo + o que é testado, em uma linha | Avançar no checkout sem First Name |
| Pré-condição | Estado antes do teste | Logado, 1 item no carrinho, na tela “Checkout: Your Information” |
| Entradas | Valores exatos digitados/escolhidos | First Name = `""`, Last Name = `Silva`, Zip = `62900-000` |
| Resultado esperado | Texto/estado exato que o sistema deve mostrar (copie da US) | “Error: First Name is required” e permanece na tela |
| Cobre | Classes, limites, regras e cenário | CI1, VL 0, RN01, CE002(US005) |

Regras práticas:

- **Um CT testa uma coisa.** Se o resultado esperado tem “e também…” de outra regra, separe em dois CTs.
- **Resultado esperado verificável:** texto exato, URL, contador, botão visível — nada de “funciona corretamente”.
- **Falhou?** Registre em [docs/04-incidentes.md](docs/04-incidentes.md) com print.
- Dica: repita os CTs com `problem_user` e `error_user` (mesma senha) — eles têm defeitos propositais.

## 4. Como escrever o teste automatizado

```js
// Documentação: docs/03-casos-de-teste/US003-adicionar-carrinho.md
import InventoryPage from '../pages/InventoryPage'
import Header from '../pages/Header'

describe('US003 — Adicionar produto ao carrinho', () => {
  beforeEach(() => {
    cy.login()              // standard_user; carrinho começa vazio
    InventoryPage.visit()
  })

  it('CT-US003-01 | adicionar pela listagem exibe "Remove" e contador 1 [CV1 | RN03]', () => {
    // Quando
    InventoryPage.addToCart('Sauce Labs Backpack')
    // Então
    InventoryPage.itemButton('Sauce Labs Backpack').should('have.text', 'Remove')
    Header.cartBadge().should('have.text', '1')
  })
})
```

- **Título do `it()`:** `CT-USxxx-NN | descrição [o que cobre]` — igual ao ID do `.md`.
- **Use os Page Objects** de `cypress/pages/` em vez de seletores soltos. Faltou algo? Adicione lá.
- **Seletores:** `cy.getByData('nome')` (atributo `data-test`, ache com F12 → inspecionar).
- **Testes independentes:** cada `it()` monta o próprio estado (não depende de outro ter rodado).
- **Sem `cy.wait(5000)`** — use `.should(...)`, o Cypress espera sozinho.
- **Tabela de valor-limite → teste data-driven** (array + `forEach`), como em `US001-login.cy.js`.
- Outro usuário: `cy.login('problem_user')` (lista em `cypress/fixtures/users.json`).

Rodar só os seus: `npm test -- --spec "cypress/e2e/US003*"` ou `npm run cy:open`.
