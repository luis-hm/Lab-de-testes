// EXEMPLO de referência — US001 (não conta no mínimo do trabalho).
// Documentação/rastreabilidade: docs/casos-de-teste/US001-login.md
import LoginPage from '../pages/LoginPage'
import Header from '../pages/Header'

const PASSWORD = Cypress.env('PASSWORD')

describe('US001 — Realizar login', () => {
  beforeEach(() => LoginPage.visit())

  it('CT-US001-01 | login válido redireciona para "Products" [CV1+CV2 | R5]', () => {
    LoginPage.login('standard_user', PASSWORD)
    cy.location('pathname').should('eq', '/inventory.html')
    Header.title().should('have.text', 'Products')
  })

  it('CT-US001-02 | Username vazio exibe "Username is required" [CI1 | R1 | VL: tamanho 0]', () => {
    LoginPage.login('', PASSWORD)
    LoginPage.error().should('have.text', 'Epic sadface: Username is required')
    cy.location('pathname').should('eq', '/')
  })

  it('CT-US001-03 | Password vazia exibe "Password is required" [CI4 | R2 | VL: tamanho 0]', () => {
    LoginPage.login('standard_user', '')
    LoginPage.error().should('have.text', 'Epic sadface: Password is required')
  })

  it('CT-US001-04 | usuário bloqueado exibe "locked out" [CI3 | R4]', () => {
    LoginPage.login('locked_out_user', PASSWORD)
    LoginPage.error().should('have.text', 'Epic sadface: Sorry, this user has been locked out.')
    cy.location('pathname').should('eq', '/')
  })

  // Valor-limite: o valor válido é uma string exata; testamos 1 caractere a menos e a mais.
  // Data-driven: um it() por linha da tabela de valor-limite.
  const limites = [
    { id: '05', campo: 'Username', user: 'standard_use', pass: PASSWORD }, // V-1
    { id: '06', campo: 'Username', user: 'standard_user1', pass: PASSWORD }, // V+1
    { id: '07', campo: 'Password', user: 'standard_user', pass: 'secret_sauc' }, // V-1
    { id: '08', campo: 'Password', user: 'standard_user', pass: 'secret_sauce1' }, // V+1
  ]
  limites.forEach(({ id, campo, user, pass }) => {
    it(`CT-US001-${id} | ${campo} fora do limite ("${campo === 'Username' ? user : pass}") é recusado [CI2/CI5 | R3 | VL]`, () => {
      LoginPage.login(user, pass)
      LoginPage.error().should('have.text', 'Epic sadface: Username and password do not match any user in this service')
    })
  })
})
