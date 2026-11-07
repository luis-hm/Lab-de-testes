// Verificação do AMBIENTE (não conta como caso de teste do trabalho).
// Garante que o site está no ar e que os Page Objects/seletores ainda batem com o sistema.
// Rode antes de começar: npx cypress run --spec cypress/e2e/00-smoke.cy.js
import Header from '../pages/Header'
import InventoryPage from '../pages/InventoryPage'
import ProductPage from '../pages/ProductPage'
import CartPage from '../pages/CartPage'
import CheckoutPage from '../pages/CheckoutPage'
import DynamicCatalogPage from '../pages/DynamicCatalogPage'

describe('Smoke — ambiente e Page Objects', () => {
  beforeEach(() => {
    cy.login()
    InventoryPage.visit()
  })

  it('catálogo bate com a fixture de produtos', () => {
    cy.fixture('products').then((products) => {
      InventoryPage.items().should('have.length', products.length)
      products.forEach((p) => InventoryPage.item(p.name).should('contain', `$${p.price}`))
      products.forEach((p) => {
        ProductPage.visit(p.id)
        ProductPage.name().should('have.text', p.name)
      })
    })
  })

  it('fluxo completo de compra percorre todos os Page Objects', () => {
    InventoryPage.addToCart('Sauce Labs Backpack')
    Header.cartBadge().should('have.text', '1')
    Header.cartLink().click()
    CartPage.quantity('Sauce Labs Backpack').should('have.text', '1')
    CartPage.checkout().click()
    CheckoutPage.fillInfo({ firstName: 'Maria', lastName: 'Silva', postalCode: '62900-000' })
    CheckoutPage.total().should('contain', '$32.39')
    CheckoutPage.finish().click()
    CheckoutPage.completeHeader().should('have.text', 'Thank you for your order!')
    CheckoutPage.generatePdf().should('be.visible')
  })

  it('menu lateral e catálogo dinâmico abrem', () => {
    Header.openDynamicCatalog('slider')
    DynamicCatalogPage.slider.dots().should('be.visible')
    Header.openDynamicCatalog('spinner')
    DynamicCatalogPage.spinner.container().should('be.visible')
    Header.openDynamicCatalog('lazy-load')
    DynamicCatalogPage.lazyLoad.container().should('be.visible')
    Header.openMenu()
    Header.logout().click()
    cy.location('pathname').should('eq', '/')
  })
})
