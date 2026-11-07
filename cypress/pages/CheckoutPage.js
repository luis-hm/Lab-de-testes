// Checkout: Your Information → Overview → Complete! — US005
const CheckoutPage = {
  // Passo 1: Your Information (/checkout-step-one.html)
  firstName: () => cy.getByData('firstName'),
  lastName: () => cy.getByData('lastName'),
  postalCode: () => cy.getByData('postalCode'),
  continue: () => cy.getByData('continue'),
  cancel: () => cy.getByData('cancel'),
  error: () => cy.getByData('error'),

  // Campo vazio ('' ou undefined) não é digitado — útil para testar obrigatoriedade.
  fillInfo({ firstName, lastName, postalCode } = {}) {
    if (firstName) this.firstName().type(firstName)
    if (lastName) this.lastName().type(lastName)
    if (postalCode) this.postalCode().type(postalCode)
    this.continue().click()
  },

  // Passo 2: Overview (/checkout-step-two.html)
  items: () => cy.getByData('inventory-item'),
  subtotal: () => cy.getByData('subtotal-label'), // "Item total: $29.99"
  tax: () => cy.getByData('tax-label'), // "Tax: $2.40"
  total: () => cy.getByData('total-label'), // "Total: $32.39"
  finish: () => cy.getByData('finish'),

  // Passo 3: Complete! (/checkout-complete.html)
  completeHeader: () => cy.getByData('complete-header'),
  completeText: () => cy.getByData('complete-text'),
  generatePdf: () => cy.contains('button', 'Generate PDF order'),
  backHome: () => cy.getByData('back-to-products'),
}

export default CheckoutPage
