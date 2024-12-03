describe('Logs in, searches for a monster, checks sorting works', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('Logs in and searches for "young red dragon", then "black pudding"', () => {
    cy.visit('http://localhost:5173/');

    cy.get('input#log-in-input').type('Cypress test user');
    cy.get('button').first().should('exist').should('have.text', 'Log in').click();

    cy.get('a').contains('Monsters').click();

    cy.get('input[type="text"]').should('exist');

    cy.get('input[type="text"]').clear().type('adult black dragon');

    cy.get('ul').should('exist');
    cy.get('input[type="text"]').should('have.value', 'adult black dragon');

    cy.wait(1000);
    cy.get('button').contains('Add to dungeon').click();

    cy.wait(1000);

    cy.get('input[type="text"]').clear();

    cy.get('button').contains('Filter Monsters').click();

    cy.wait(1000);

    // Select the "construct" filter checkbox
    cy.contains('label', 'undead').find('input[type="checkbox"]').check({ force: true });

    // Return from filtermenu
    cy.get('[aria-label="close"]').click();

    cy.wait(1000);

    cy.get('button').contains('Add to dungeon').click();

    cy.wait(1000);

    cy.get('a').contains('Dungeon').click();

    cy.wait(3000);
    cy.get('button').contains('Remove from dungeon').click();
    cy.wait(3000);
    cy.get('button').contains('Remove from dungeon').click();
  });
});
