describe('template spec', () => {
  it('passes', () => {
    /*
      As a user, I wish to login to the app, view monsters. And add a monster to my dungeon
     */

    // login
    cy.visit('http://localhost:5173/');
    cy.get('input').type('Cypress test user');
    cy.get('button').first().should('exist').should('have.text', 'Log in').click();

    // Navigate to monster page
    cy.get('button').first().click();
    cy.get('.sub-header').first().should('have.text', 'Monsters').get('button').first().should('exist').click();
  });
});
