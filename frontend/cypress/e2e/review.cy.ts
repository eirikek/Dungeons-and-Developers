describe('Creates a review, then deletes it', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('Logs in', () => {
    cy.visit('http://localhost:5173/');

    cy.get('input#log-in-input').type('Cypress test user');
    cy.get('button').first().should('exist').should('have.text', 'Log in').click();
    cy.wait(2000);
  });
});
