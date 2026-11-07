// Página "Products" (/inventory.html) — US002, US003, US008
const InventoryPage = {
  visit: () => cy.visit('/inventory.html'),
  items: () => cy.getByData('inventory-item'),
  names: () => cy.getByData('inventory-item-name'),
  prices: () => cy.getByData('inventory-item-price'),
  sortSelect: () => cy.getByData('product-sort-container'),
  activeSort: () => cy.getByData('active-option'),

  // option: 'az' | 'za' | 'lohi' | 'hilo' (ou o texto visível, ex.: 'Price (low to high)')
  sortBy: (option) => cy.getByData('product-sort-container').select(option),

  item: (name) => cy.contains('[data-test="inventory-item"]', name),
  itemButton(name) {
    return this.item(name).find('button')
  },
  addToCart(name) {
    this.itemButton(name).should('have.text', 'Add to cart').click()
  },
  removeFromCart(name) {
    this.itemButton(name).should('have.text', 'Remove').click()
  },
  openProduct: (name) => cy.contains('[data-test="inventory-item-name"]', name).click(),

  // Textos/valores na ordem exibida, para comparar ordenação.
  nameTexts: () => cy.getByData('inventory-item-name').then(($els) => Cypress._.map($els, 'innerText')),
  priceValues: () =>
    cy.getByData('inventory-item-price').then(($els) => Cypress._.map($els, (el) => Number(el.innerText.replace('$', '')))),
}

export default InventoryPage
