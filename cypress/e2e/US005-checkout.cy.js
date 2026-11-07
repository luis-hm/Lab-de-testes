// Responsável: Luis Felipe Holanda Martins
// Documentação/rastreabilidade: docs/03-casos-de-teste/US005-checkout.md
import InventoryPage from '../pages/InventoryPage'
import Header from '../pages/Header'
import CartPage from '../pages/CartPage'
import CheckoutPage from '../pages/CheckoutPage'

describe('US005 — Finalizar compra (checkout)', () => {
  beforeEach(() => {
    cy.login()
    InventoryPage.visit()
  })

  it('CT-US005-01 | compra com 1 item calcula Tax de 8% e conclui o pedido [CV1-CV4 | R4 | RN03-RN05, RN07 | CE001]', () => {
    // Dado: "Sauce Labs Backpack" ($29.99) no carrinho
    InventoryPage.addToCart('Sauce Labs Backpack')
    Header.cartLink().click()
    CartPage.checkout().click()

    // Quando: preenche os 3 campos e continua
    CheckoutPage.fillInfo({ firstName: 'Maria', lastName: 'Silva', postalCode: '62900-000' })

    // Então: Overview com valores corretos
    cy.location('pathname').should('eq', '/checkout-step-two.html')
    CheckoutPage.subtotal().should('have.text', 'Item total: $29.99')
    CheckoutPage.tax().should('have.text', 'Tax: $2.40')
    CheckoutPage.total().should('have.text', 'Total: $32.39')

    // E: ao finalizar, pedido confirmado e carrinho esvaziado
    CheckoutPage.finish().click()
    CheckoutPage.completeHeader().should('have.text', 'Thank you for your order!')
    Header.cartBadge().should('not.exist')
  })

  // Tabela de decisão do grafo de causa e efeito: um it() por linha.
  // Campos ausentes do objeto ficam vazios (não são digitados).
  const regras = [
    { regra: 'R1', caso: 'First Name vazio', dados: { lastName: 'Silva', postalCode: '62900-000' }, erro: 'Error: First Name is required' },
    { regra: 'R1', caso: 'todos os campos vazios', dados: {}, erro: 'Error: First Name is required' },
    { regra: 'R2', caso: 'Last Name vazio', dados: { firstName: 'Maria', postalCode: '62900-000' }, erro: 'Error: Last Name is required' },
    { regra: 'R3', caso: 'Zip/Postal Code vazio', dados: { firstName: 'Maria', lastName: 'Silva' }, erro: 'Error: Postal Code is required' },
  ]
  regras.forEach(({ regra, caso, dados, erro }) => {
    it(`CT-US005-02 (${regra}) | ${caso} exibe "${erro}" e não avança [CI1-CI3 | VL 0 | ${regra} | RN01 | CE002, CE003]`, () => {
      InventoryPage.addToCart('Sauce Labs Backpack')
      cy.visit('/checkout-step-one.html')

      CheckoutPage.fillInfo(dados)

      CheckoutPage.error().should('have.text', erro)
      cy.location('pathname').should('eq', '/checkout-step-one.html')
    })
  })
})
