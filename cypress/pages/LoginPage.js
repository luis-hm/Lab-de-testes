// Tela de login — US001
const LoginPage = {
  visit: () => cy.visit('/'),
  username: () => cy.getByData('username'),
  password: () => cy.getByData('password'),
  submit: () => cy.getByData('login-button'),
  error: () => cy.getByData('error'),
  closeError: () => cy.getByData('error-button'),

  // Campo vazio ('' ou undefined) não é digitado — útil para testar obrigatoriedade.
  login(username, password) {
    if (username) this.username().type(username)
    if (password) this.password().type(password, { log: false })
    this.submit().click()
  },
}

export default LoginPage
