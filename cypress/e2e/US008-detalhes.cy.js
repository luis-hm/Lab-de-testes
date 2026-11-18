
describe('US008 - Visualizar detalhes de um produto', () => {

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com');

    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
  });

  // CT-US008-01 - Abrir detalhes de produto existente
  it('CT-US008-01 - Abrir detalhes de produto existente', () => {

    cy.contains('.inventory_item', 'Sauce Labs Backpack')
      .find('.inventory_item_name')
      .click();

    cy.url().should('include', 'inventory-item.html');

    cy.get('.inventory_details_name')
      .should('contain', 'Sauce Labs Backpack');

    cy.get('.inventory_details_desc')
      .should('be.visible');

    cy.get('.inventory_details_price')
      .should('contain', '$29.99');

    cy.get('[data-test="add-to-cart"]')
      .should('be.visible');

    cy.contains('Back to products')
      .should('be.visible');
  });


  // CT-US008-02 - Acessar produto inexistente
  it('CT-US008-02 - Acessar produto inexistente', () => {

    cy.visit('https://www.saucedemo.com/inventory-item.html?id=99');

    // Verifica a mensagem de produto inexistente
    cy.contains('ITEM NOT FOUND')
      .should('be.visible');

    // Verifica se o preço não apresenta um valor monetário válido
    cy.get('.inventory_details_price').should(($price) => {
      const valor = $price.text().trim();

      expect(valor).not.to.match(/\$\s*\d+(?:\.\d{2})?/);
    });

    // Verifica se o botão de adicionar ao carrinho não existe
    cy.get('[data-test="add-to-cart"]')
      .should('not.exist');

  });

});
