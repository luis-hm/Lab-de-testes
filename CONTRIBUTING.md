# Como contribuir com seus casos de teste

Fluxo para cada integrante. Cada pessoa trabalha nos **seus próprios arquivos** (um `.md` e um `.cy.js` por US), então ninguém pisa no código de ninguém.

## 1. Pegue sua US

Veja em [docs/02-plano-de-teste.md](docs/02-plano-de-teste.md) qual US é sua e preencha seu nome lá. Leia a US em [docs/01-especificacao-parte1.md](docs/01-especificacao-parte1.md) — regras de negócio (RN), cenários (CE) e critérios de aceite são a base dos testes.

## 2. Crie uma branch

```bash
git checkout main && git pull
git checkout -b us003-luis        # us<numero>-<seu-nome>
```

## 3. Projete os casos de teste (documentação primeiro)

```bash
cp docs/03-casos-de-teste/_TEMPLATE.md docs/03-casos-de-teste/US003-adicionar-carrinho.md
```

Preencha na ordem — o professor avalia **como** os CTs saíram das técnicas:

1. **Classes de equivalência:** liste as condições de entrada da US e separe classes válidas (CV) e inválidas (CI).
2. **Valor-limite:** para cada condição com faixa/limite, teste o limite e os vizinhos (limite −1, limite, limite +1).
3. **Causa e efeito** (quando a US tiver combinações de condições): causas, efeitos, tabela de decisão.
4. **Casos de teste:** cada CT aponta para as classes/limites/regras que cobre. ID: `CT-US003-01`, `CT-US003-02`…
5. Marque quais CTs são **manuais** e quais são **automatizados** (mín. 3 manuais + 2 automatizados por pessoa).

O exemplo completo está em [docs/03-casos-de-teste/US001-login.md](docs/03-casos-de-teste/US001-login.md).

## 4. Execute os testes manuais

Siga os passos de cada CT manual no site e registre na tabela de execução: data, resultado (Passou/Falhou) e print em `docs/img/`. Se falhou → registre em [docs/04-incidentes.md](docs/04-incidentes.md).

> 💡 Dica para achar defeitos de verdade: repita os testes com `problem_user`, `error_user` e `performance_glitch_user` (mesma senha). Eles têm bugs propositais.

## 5. Automatize no Cypress

Crie `cypress/e2e/US003-adicionar-carrinho.cy.js` (mesmo nome do `.md`):

```js
// Documentação/rastreabilidade: docs/03-casos-de-teste/US003-adicionar-carrinho.md
import InventoryPage from '../pages/InventoryPage'
import Header from '../pages/Header'

describe('US003 — Adicionar produto ao carrinho', () => {
  beforeEach(() => {
    cy.login()              // standard_user, sessão em cache; carrinho começa vazio
    InventoryPage.visit()
  })

  it('CT-US003-01 | adicionar pela listagem exibe "Remove" e contador 1 [CV1 | RN03]', () => {
    InventoryPage.addToCart('Sauce Labs Backpack')
    InventoryPage.itemButton('Sauce Labs Backpack').should('have.text', 'Remove')
    Header.cartBadge().should('have.text', '1')
  })
})
```

Regras do jogo:

- **Título do `it()` começa com o ID do CT** (`CT-US003-01 | ...`) e termina com o que cobre (`[CV1 | VL | RN03]`). É assim que o relatório do Cypress se liga à documentação.
- **Use os Page Objects** de `cypress/pages/` — não escreva seletor solto no spec. Faltou um seletor/ação? Adicione no Page Object (só o que você precisa) e avise no PR.
- **Seletores:** prefira `cy.getByData('nome')` (atributo `data-test`). Para achar: DevTools (F12) → inspecionar elemento.
- **Cada teste é independente:** não dependa de outro `it()` ter rodado antes. Monte o estado no próprio teste ou no `beforeEach`.
- **Sem `cy.wait(5000)`** — use asserções (`.should(...)`), o Cypress já espera sozinho.
- **Tabelas de valor-limite viram testes data-driven** (array + `forEach`) — veja `US001-login.cy.js`.
- Usuário diferente: `cy.login('problem_user')`. Usuários disponíveis em `cypress/fixtures/users.json`.

Rode só os seus enquanto desenvolve:

```bash
npm run cy:open                                  # interativo
npm test -- --spec "cypress/e2e/US003*"          # headless
```

## 6. Abra o Pull Request

```bash
git add docs/ cypress/
git commit -m "test(US003): casos de teste de adicionar ao carrinho"
git push -u origin us003-luis
```

Abra o PR para `main`. O GitHub Actions roda todos os testes automaticamente. Peça revisão de pelo menos 1 colega antes do merge.

**Checklist do PR:**

- [ ] `.md` da US com classes de equivalência, valor-limite (e causa-efeito se aplicável)
- [ ] ≥ 3 CTs manuais executados e registrados (com data e evidência)
- [ ] ≥ 2 CTs automatizados, com o ID no título do `it()`
- [ ] Defeitos encontrados registrados em `docs/04-incidentes.md`
- [ ] Linha atualizada na tabela de responsabilidades do plano de teste
