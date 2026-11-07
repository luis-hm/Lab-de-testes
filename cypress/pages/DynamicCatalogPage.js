// Catálogo dinâmico (menu ☰ → Dynamic Catalog) — US007
// Abra com Header.openDynamicCatalog('lazy-load' | 'spinner' | 'slider').
const DynamicCatalogPage = {
  lazyLoad: {
    container: () => cy.getByData('dynamic-catalog-lazy-load-container'),
    sentinel: () => cy.getByData('dynamic-catalog-lazy-load-sentinel'),
  },
  spinner: {
    container: () => cy.getByData('dynamic-catalog-spinner-container'),
    grid: () => cy.getByData('dynamic-catalog-spinner-grid'),
    loading: () => cy.getByData('dynamic-catalog-spinner'),
  },
  slider: {
    container: () => cy.getByData('dynamic-catalog-slider-container'),
    dots: () => cy.getByData('dynamic-catalog-slider-dots'),
    dot: (i) => cy.getByData(`dynamic-catalog-slider-dot-${i}`),
  },
}

export default DynamicCatalogPage
