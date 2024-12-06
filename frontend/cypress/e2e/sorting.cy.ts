describe('Logs in, filters a monster, checks sorting works', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('Logs in and sorts on all different categories', () => {
    cy.visit('http://it2810-20.idi.ntnu.no/project2/');
    cy.get('input#log-in-input').type('Cypress test user');
    cy.get('button').first().should('exist').should('have.text', 'Log in').click();

    cy.get('a').contains('Monsters').click();

    cy.get('button').contains('A-Z').click();

    cy.contains('li', 'Difficulty: Low-High').click({ force: true });

    cy.wait(2000);

    cy.get('button').contains('Difficulty: Low-High').click({ force: true });

    cy.contains('li', 'Difficulty: High-Low').click({ force: true });

    cy.wait(2000);

    cy.get('button').contains('Difficulty: High-Low').click({ force: true });

    cy.contains('li', 'Z-A').click({ force: true });

    cy.wait(2000);

    cy.get('button').contains('Z-A').click({ force: true });

    cy.contains('li', 'Most Reviewed').click({ force: true });
  });
});
