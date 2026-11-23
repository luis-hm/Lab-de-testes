// Responsável: Ricardo Alves da Silva
// Documentação/rastreabilidade: docs/03-casos-de-teste/US007-catalogo-dinamico.md
import Header from '../pages/Header'
import InventoryPage from '../pages/InventoryPage'
import DynamicCatalogPage from '../pages/DynamicCatalogPage'

/** Rola progressivamente o modo Lazy Load até carregar todos os itens esperados. */
function loadAllLazyItems(expectedCount, remainingScrolls = 8) {
  cy.get('body').then(($body) => {
    const loaded = $body.find('[data-test="inventory-item"]').length
    if (loaded >= expectedCount || remainingScrolls <= 0) return

    const $sentinel = $body.find('[data-test="dynamic-catalog-lazy-load-sentinel"]')
    if ($sentinel.length) {
      cy.wrap($sentinel).scrollIntoView({ duration: 150 })
    } else {
      cy.scrollTo('bottom', { duration: 150 })
    }
    // Pequena pausa para o IntersectionObserver processar o lote após a rolagem
    cy.wait(250)
    loadAllLazyItems(expectedCount, remainingScrolls - 1)
  })
}

/** Verifica que o indicador do Slider na posição informada está destacado como ativo. */
function assertSliderDotActive(activeIndex, inactiveIndex) {
  DynamicCatalogPage.slider.dot(activeIndex).then(($activeDot) => {
    const hasActiveSemantics =
      $activeDot.attr('aria-current') === 'true' ||
      $activeDot.attr('aria-selected') === 'true' ||
      $activeDot.attr('aria-pressed') === 'true' ||
      /active|selected/i.test($activeDot.attr('class') || '')

    if (hasActiveSemantics) {
      expect(hasActiveSemantics).to.be.true
      return
    }

    DynamicCatalogPage.slider.dot(inactiveIndex).then(($otherDot) => {
      expect(getComputedStyle($activeDot[0]).backgroundColor).to.not.eq(
        getComputedStyle($otherDot[0]).backgroundColor,
      )
    })
  })
}

describe('US007 — Visualizar catálogo dinâmico', () => {
  beforeEach(() => {
    cy.login() // standard_user; sessão em cache
    InventoryPage.visit()
  })

  it('CT-US007-01 | carregar catálogo completo no modo Lazy Load sem duplicatas [CV1, CV2 | VL 6 | R1 | RN01, RN04 | CE001]', () => {
    // Dado: usuário autenticado abre Dynamic Catalog -> Lazy Load
    Header.openDynamicCatalog('lazy-load')
    Header.title().should('have.text', 'Dynamic Catalog - Lazy Load')
    DynamicCatalogPage.lazyLoad.container().should('be.visible')

    // Quando: rola a página progressivamente até o final do catálogo
    cy.fixture('products').then((products) => {
      loadAllLazyItems(products.length)

      // Então: todos os 6 produtos são carregados com imagem, nome e preço, sem duplicidades
      InventoryPage.items().should('have.length', products.length)
      InventoryPage.nameTexts().then((names) => {
        expect(new Set(names).size).to.eq(products.length)
        products.forEach((produto) => {
          expect(names).to.include(produto.name)
          InventoryPage.item(produto.name).within(() => {
            cy.get('img')
              .should('be.visible')
              .and(($img) => expect($img[0].naturalWidth).to.be.greaterThan(0))
            cy.getByData('inventory-item-price').should('have.text', `$${produto.price}`)
          })
        })
      })
    })
  })

  it('CT-US007-02 | navegar para a terceira posição no modo Slider exibe "Sauce Labs Onesie" e indicador ativo [CV1, CV4, CV5 | R3 | RN03, RN04 | CE002]', () => {
    // Dado: usuário autenticado abre Dynamic Catalog -> Slider
    Header.openDynamicCatalog('slider')
    Header.title().should('have.text', 'Dynamic Catalog - Slider')
    DynamicCatalogPage.slider.container().should('be.visible')
    DynamicCatalogPage.slider.dots().should('be.visible')

    // Quando: clica no 3º indicador de posição (índice 2, 0-based -> produto id 2)
    DynamicCatalogPage.slider.dot(2).should('be.visible').click()

    // Então: exibe apenas o 3º produto ("Sauce Labs Onesie", $7.99) e destaca o 3º indicador
    DynamicCatalogPage.slider.container().then(($container) => {
      const box = $container[0].getBoundingClientRect()
      const visibleCards = [...$container[0].querySelectorAll('[data-test="inventory-item"]')].filter((el) => {
        const rect = el.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0 && rect.right > box.left && rect.left < box.right
      })
      expect(visibleCards).to.have.length(1)
      expect(visibleCards[0].innerText).to.include('Sauce Labs Onesie')
      expect(visibleCards[0].innerText).to.include('$7.99')
    })

    InventoryPage.item('Sauce Labs Onesie')
      .find('img')
      .should('be.visible')
      .and(($img) => expect($img[0].naturalWidth).to.be.greaterThan(0))

    assertSliderDotActive(2, 0)
  })
})
