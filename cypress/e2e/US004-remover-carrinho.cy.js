// Responsável: Samira Kelvia Oliveira De Sousa
// Documentação/rastreabilidade: docs/03-casos-de-teste/US004-remover-carrinho.md
// Observação: os itens são adicionados pela listagem (fluxo da US003) antes de abrir "Your Cart".
import InventoryPage from '../pages/InventoryPage'
import CartPage from '../pages/CartPage'
import Header from '../pages/Header'

describe('US004 — Remover produto do carrinho', () => {
  beforeEach(() => {
    cy.login() // standard_user; o carrinho começa vazio em cada teste
    InventoryPage.visit()
  })

  it('CT-US004-01 | remover 1 de 2 itens mantém o outro com QTY 1 e contador 1 [CV1, CV3 | VL 2→1 | RN02, RN03, RN04 | CE001]', () => {
    // Dado: "Sauce Labs Backpack" e "Sauce Labs Bike Light" no carrinho (contador 2)
    InventoryPage.addToCart('Sauce Labs Backpack')
    InventoryPage.addToCart('Sauce Labs Bike Light')
    Header.cartBadge().should('have.text', '2')
    Header.cartLink().click()

    // Quando: clica em "Remove" no "Sauce Labs Bike Light"
    CartPage.remove('Sauce Labs Bike Light')

    // Então: o item some, o contador vira 1 e o outro item permanece com QTY 1
    cy.contains('[data-test="inventory-item"]', 'Sauce Labs Bike Light').should('not.exist')
    CartPage.items().should('have.length', 1)
    Header.cartBadge().should('have.text', '1')
    CartPage.quantity('Sauce Labs Backpack').should('have.text', '1')
  })

  it('CT-US004-02 | remover o último item esvazia o carrinho, oculta o contador e devolve "Add to cart" na listagem [CV2, CV4 | VL 1→0 | RN04, RN05 | CE002]', () => {
    InventoryPage.addToCart('Sauce Labs Backpack')
    Header.cartLink().click()

    CartPage.remove('Sauce Labs Backpack')

    // Lista vazia e contador oculto
    CartPage.items().should('not.exist')
    Header.cartBadge().should('not.exist')

    // E: ao voltar, o produto aparece com "Add to cart" (RN05)
    CartPage.continueShopping().click()
    cy.location('pathname').should('eq', '/inventory.html')
    InventoryPage.itemButton('Sauce Labs Backpack').should('have.text', 'Add to cart')
  })

  it('CT-US004-03 | remover os 6 itens, um a um, decrementa o contador de 5 até ocultá-lo [CV1, CV2 | VL 6→5, 1→0 | RN03, RN04]', () => {
    cy.fixture('products').then((products) => {
      products.forEach((p) => InventoryPage.addToCart(p.name))
      Header.cartBadge().should('have.text', String(products.length))
      Header.cartLink().click()

      products.forEach((_, i) => {
        // remove sempre o primeiro item da lista
        CartPage.items().first().find('button').click()
        const restantes = products.length - i - 1
        if (restantes > 0) {
          Header.cartBadge().should('have.text', String(restantes))
          CartPage.items().should('have.length', restantes)
        } else {
          Header.cartBadge().should('not.exist')
          CartPage.items().should('not.exist')
        }
      })
    })
  })
})
