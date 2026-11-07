// Cabeçalho comum às páginas internas: carrinho + menu lateral (☰) — US003, US004, US006, US007
const Header = {
  title: () => cy.getByData('title'),
  cartLink: () => cy.getByData('shopping-cart-link'),
  cartBadge: () => cy.getByData('shopping-cart-badge'),

  openMenu: () => cy.get('#react-burger-menu-btn').click(),
  closeMenu: () => cy.get('#react-burger-cross-btn').click(),
  allItems: () => cy.getByData('inventory-sidebar-link'),
  about: () => cy.getByData('about-sidebar-link'),
  logout: () => cy.getByData('logout-sidebar-link'),
  resetAppState: () => cy.getByData('reset-sidebar-link'),
  dynamicCatalog: () => cy.getByData('dynamic-catalog-sidebar-link'),

  // mode: 'lazy-load' | 'spinner' | 'slider'
  openDynamicCatalog(mode) {
    this.openMenu()
    this.dynamicCatalog().click()
    cy.getByData(`dynamic-catalog-${mode}-link`).click()
  },
}

export default Header
