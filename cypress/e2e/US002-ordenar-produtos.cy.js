// Responsável: João Fenelon Ramos Soares
// Documentação/rastreabilidade: docs/03-casos-de-teste/US002-ordenar-produtos.md
import InventoryPage from '../pages/InventoryPage'

const TOTAL_PRODUTOS = 6

// Ordem padrão "Name (A to Z)" (RN01)
const ORDEM_AZ = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
]

// Ordem esperada em "Name (Z to A)"
const ORDEM_ZA = [...ORDEM_AZ].reverse()

describe('US002 — Ordenar produtos do catálogo', () => {
  beforeEach(() => {
    cy.login() // standard_user; o carrinho começa vazio em cada teste
    InventoryPage.visit()
  })

  it('CT-US002-01 | ordenar por preço do menor para o maior mostra "Sauce Labs Onesie" ($7.99) primeiro, "Sauce Labs Fleece Jacket" ($49.99) por último e atualiza o seletor [CV1, CV2, CV4, CV6, CV8 | VL posição 1 e 6 | R3 | RN01, RN04 | CE001]', () => {
    // Dado: ordem padrão "Name (A to Z)" (CV2, RN01)
    InventoryPage.activeSort().should('have.text', 'Name (A to Z)')
    InventoryPage.nameTexts().should('deep.equal', ORDEM_AZ)

    // Quando: seleciona "Price (low to high)"
    InventoryPage.sortBy('Price (low to high)')

    // Então: seletor mostra a opção escolhida e continuam 6 produtos (RN04)
    InventoryPage.activeSort().should('have.text', 'Price (low to high)')
    InventoryPage.items().should('have.length', TOTAL_PRODUTOS)

    // E: limites da lista — posição 1 (mais barato) e posição 6 (mais caro)
    InventoryPage.names().first().should('have.text', 'Sauce Labs Onesie')
    InventoryPage.prices().first().should('have.text', '$7.99')
    InventoryPage.names().last().should('have.text', 'Sauce Labs Fleece Jacket')
    InventoryPage.prices().last().should('have.text', '$49.99')

    // E: preços em ordem crescente (CV4, CV6)
    InventoryPage.priceValues().then((valores) => {
      expect(valores).to.deep.equal([...valores].sort((a, b) => a - b))
    })
  })

  it('CT-US002-02 | ordenar por nome de Z para A mostra "Test.allTheThings() T-Shirt (Red)" primeiro, "Sauce Labs Backpack" por último e atualiza o seletor [CV1, CV3, CV8 | VL posição 1 e 6 | R2 | RN04 | CE002]', () => {
    // Quando: seleciona "Name (Z to A)"
    InventoryPage.sortBy('Name (Z to A)')

    // Então: seletor mostra a opção escolhida e continuam 6 produtos (RN04)
    InventoryPage.activeSort().should('have.text', 'Name (Z to A)')
    InventoryPage.items().should('have.length', TOTAL_PRODUTOS)

    // E: limites da lista — posição 1 e posição 6
    InventoryPage.names().first().should('have.text', 'Test.allTheThings() T-Shirt (Red)')
    InventoryPage.names().last().should('have.text', 'Sauce Labs Backpack')

    // E: lista inteira em ordem alfabética decrescente
    InventoryPage.nameTexts().should('deep.equal', ORDEM_ZA)
  })
})