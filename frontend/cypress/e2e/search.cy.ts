describe('Logs in, searches for a monster', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('Logs in and searches for "young red dragon", then "black pudding"', () => {
    cy.visit('http://localhost:5173/');

    cy.get('input#log-in-input').type('Cypress test user');
    cy.get('button').first().should('exist').should('have.text', 'Log in').click();

    cy.get('a').contains('Monsters').click();

    cy.get('input[type="text"]').should('exist');

    cy.get('input[type="text"]').clear().type('young red dragon');

    cy.get('ul').should('exist');
    cy.get('input[type="text"]').should('have.value', 'young red dragon');

    cy.wait(1000);

    cy.get('input[type="text"]').clear().type('black pudding');

    cy.get('input[type="text"]').should('have.value', 'black pudding');

    cy.get('ul').should('exist');
  });
});
