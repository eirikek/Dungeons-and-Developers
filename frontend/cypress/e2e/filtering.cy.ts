describe('Logs in, filters a monster, checks filtering works', () => {
  beforeEach(() => {
    // Set viewport to desktop size
    cy.viewport(1280, 720);
  });

  it('Logs in and applies "construct" filter', () => {
    // Log in
    cy.visit('http://localhost:5173/');
    cy.get('input').type('Cypress test user');
    cy.get('button').first().should('exist').should('have.text', 'Log in').click();

    // Navigate to the monster page
    cy.get('a').contains('Monsters').click();

    // Open the filter dropdown
    cy.get('button').contains('Filter Monsters').click();

    cy.wait(1000);

    // Select the "construct" filter checkbox
    cy.contains('label', 'construct').find('input[type="checkbox"]').check({ force: true });

    // Return from filtermenu
    cy.get('[aria-label="close"]').click();

    cy.wait(1000);

    // Verify that the filter was applied
    cy.get('.grid').children().should('have.length.greaterThan', 0);

    // Verify all displayed monster cards have "type=construct"
    cy.get('.grid')
      .children()
      .each((card) => {
        cy.wrap(card).should('contain.text', 'Type: construct'); // Adjust based on how type is displayed
      });
  });
});
