describe('Logs in, filters a monster, checks filtering works', () => {
  beforeEach(() => {
    // Set viewport to desktop size
    cy.viewport(1280, 720);
  });

  it('Passes the user story', () => {
    // Log in
    cy.visit('http://localhost:5173/');
    cy.get('input').type('Cypress test user');
    cy.get('button').first().should('exist').should('have.text', 'Log in').click();

    // Navigates to monster page
    cy.get('a').eq(2).should('have.text', 'Monsters').click();

    // Access filtering button, filter by "Construct" type

    cy.get('button').contains('Filter Monsters').click();
    cy.contains('label', 'construct').find('input[type="checkbox"]').check({ force: true });

    // Checks that the filtering gives monsterpage with results
    cy.get('.grid').children().should('have.length.greaterThan', 0);

    // Check that all monstercards on page now are only of type "construct"
    cy.get('.grid')
      .children()
      .each((card) => {
        cy.wrap(card).should('contain.text', 'Type: construct');
      });
  });
});
