import LoginPage from '../pages/LoginPage'

// Seleciona por [data-test="..."] — atributo estável exposto pelo Swag Labs.
Cypress.Commands.add('getByData', (value) => cy.get(`[data-test="${value}"]`))

// O Swag Labs é uma SPA no GitHub Pages: rotas internas (/inventory.html, /cart.html...)
// respondem HTTP 404 mas carregam o app normalmente. Sem isto, todo cy.visit direto falharia.
Cypress.Commands.overwrite('visit', (visit, url, options) => visit(url, { failOnStatusCode: false, ...options }))

// Login via UI com cache de sessão (cy.session): só passa pela tela de login
// na 1ª vez por usuário; nos testes seguintes reaproveita o cookie.
// O carrinho (localStorage) é limpo entre testes, então cada teste começa do zero.
Cypress.Commands.add('login', (username = 'standard_user', password = Cypress.env('PASSWORD')) => {
  cy.session(
    username,
    () => {
      LoginPage.visit()
      LoginPage.login(username, password)
      cy.location('pathname').should('eq', '/inventory.html')
    },
    { cacheAcrossSpecs: true },
  )
})
