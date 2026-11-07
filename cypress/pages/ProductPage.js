// Página de detalhes do produto (/inventory-item.html?id=N) — US008
const ProductPage = {
  visit: (id) => cy.visit(`/inventory-item.html?id=${id}`),
  name: () => cy.getByData('inventory-item-name'),
  description: () => cy.getByData('inventory-item-desc'),
  price: () => cy.getByData('inventory-item-price'),
  addToCart: () => cy.getByData('add-to-cart'),
  remove: () => cy.getByData('remove'),
  backToProducts: () => cy.getByData('back-to-products'),
}

export default ProductPage
