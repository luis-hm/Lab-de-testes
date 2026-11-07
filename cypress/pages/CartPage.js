// Página "Your Cart" (/cart.html) — US003, US004
const CartPage = {
  visit: () => cy.visit('/cart.html'),
  items: () => cy.getByData('inventory-item'),
  item: (name) => cy.contains('[data-test="inventory-item"]', name),
  quantity: (name) => cy.contains('[data-test="inventory-item"]', name).find('[data-test="item-quantity"]'),
  remove: (name) => cy.contains('[data-test="inventory-item"]', name).find('button').click(),
  checkout: () => cy.getByData('checkout'),
  continueShopping: () => cy.getByData('continue-shopping'),
}

export default CartPage
