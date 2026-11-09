// Responsável: Samira Kelvia Oliveira De Sousa
// Documentação/rastreabilidade: docs/03-casos-de-teste/US003-adicionar-carrinho.md
import InventoryPage from '../pages/InventoryPage'
import ProductPage from '../pages/ProductPage'
import CartPage from '../pages/CartPage'
import Header from '../pages/Header'

describe('US003 — Adicionar produto ao carrinho', () => {
  beforeEach(() => {
    cy.login() // standard_user; o carrinho começa vazio em cada teste
    InventoryPage.visit()
  })

  it('CT-US003-01 | adicionar pela listagem (carrinho vazio) troca o botão para "Remove", mostra contador 1 e lista o item em "Your Cart" [CV1, CV2, CV4 | VL 0→1 | RN01, RN03 | CE001]', () => {
    // Dado: carrinho vazio (sem contador no ícone) — limite inferior (0 itens)
    Header.cartBadge().should('not.exist')

    // Quando: clica em "Add to cart" no "Sauce Labs Backpack"
    InventoryPage.addToCart('Sauce Labs Backpack')

    // Então: botão vira "Remove" e o contador mostra 1
    InventoryPage.itemButton('Sauce Labs Backpack').should('have.text', 'Remove')
    Header.cartBadge().should('have.text', '1')

    // E: "Your Cart" lista o produto com QTY 1 e preço $29.99
    Header.cartLink().click()
    CartPage.items().should('have.length', 1)
    CartPage.quantity('Sauce Labs Backpack').should('have.text', '1')
    CartPage.item('Sauce Labs Backpack').should('contain', '$29.99')
  })

  it('CT-US003-02 | adicionar pela página de detalhes mantém "Remove" e contador 1 ao voltar para "Products" [CV1, CV3 | RN03, RN04 | CE002]', () => {
    // Dado: usuário abre os detalhes do "Sauce Labs Backpack" (US008)
    InventoryPage.openProduct('Sauce Labs Backpack')
    cy.location('pathname').should('eq', '/inventory-item.html')

    // Quando: clica em "Add to cart"
    ProductPage.addToCart().click()

    // Então: botão vira "Remove" e contador mostra 1
    ProductPage.remove().should('be.visible')
    Header.cartBadge().should('have.text', '1')

    // E: ao voltar, o mesmo produto aparece com "Remove" (RN04)
    ProductPage.backToProducts().click()
    InventoryPage.itemButton('Sauce Labs Backpack').should('have.text', 'Remove')
    Header.cartBadge().should('have.text', '1')
  })

  it('CT-US003-03 | adicionar os 6 produtos, um a um, incrementa o contador de 1 a 6 e esgota os botões "Add to cart" [CV4, CI2 | VL 1, 5, 6 | RN01, RN03]', () => {
    cy.fixture('products').then((products) => {
      products.forEach((produto, i) => {
        InventoryPage.addToCart(produto.name)
        // contador exato = nº de produtos distintos já adicionados (RN03)
        Header.cartBadge().should('have.text', String(i + 1))
      })

      // Limite superior (6 itens): não sobra nenhum botão "Add to cart" (não há 7º produto)
      InventoryPage.items().should('have.length', products.length)
      InventoryPage.items()
        .find('button')
        .each(($btn) => expect($btn.text()).to.eq('Remove'))

      // E: "Your Cart" lista os 6 itens
      Header.cartLink().click()
      CartPage.items().should('have.length', products.length)
    })
  })
})
