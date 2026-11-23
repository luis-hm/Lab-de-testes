// Responsável: Arthur Gomes Menezes
// Documentação/rastreabilidade: docs/03-casos-de-teste/US006-menu-lateral.md
import Header from '../pages/Header'
import InventoryPage from '../pages/InventoryPage'
import LoginPage from '../pages/LoginPage'

describe('US006 — Navegar pelo menu lateral', () => {
  beforeEach(() => {
    cy.login() // standard_user; o carrinho começa vazio em cada teste
    InventoryPage.visit()
  })

  it('CT-US006-01 | encerrar sessão pelo menu lateral (Logout) redireciona para login com campos vazios [CV1, CV4 | R2 | RN01, RN02 | CE001]', () => {
    // Dado: usuário autenticado na página "Products"
    cy.location('pathname').should('eq', '/inventory.html')

    // Quando: abre o menu lateral e clica em "Logout"
    Header.openMenu()
    Header.logout().should('be.visible').click()

    // Então: encerra a sessão e exibe a tela de login com os campos vazios
    cy.location('pathname').should('eq', '/')
    LoginPage.username().should('be.visible').and('have.value', '')
    LoginPage.password().should('be.visible').and('have.value', '')
  })

  it('CT-US006-02 | reiniciar estado da aplicação (Reset App State) esvazia o carrinho e restaura "Add to cart" [CV1, CV5, CV9 | VL 1..6 | R3 | RN03 | CE002]', () => {
    // Dado: 2 produtos adicionados ao carrinho (contador "2")
    InventoryPage.addToCart('Sauce Labs Backpack')
    InventoryPage.addToCart('Sauce Labs Bike Light')
    Header.cartBadge().should('have.text', '2')

    // Quando: abre o menu lateral e clica em "Reset App State"
    Header.openMenu()
    Header.resetAppState().should('be.visible').click()

    // Então: permanece autenticado em "Products", o contador some e os botões voltam para "Add to cart"
    // INC-03: no Swag Labs, os botões permanecem como "Remove" sem recarregar a página
    cy.location('pathname').should('eq', '/inventory.html')
    Header.cartBadge().should('not.exist')
    InventoryPage.itemButton('Sauce Labs Backpack').should('have.text', 'Add to cart')
    InventoryPage.itemButton('Sauce Labs Bike Light').should('have.text', 'Add to cart')
  })
})
