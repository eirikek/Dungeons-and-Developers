describe('Updates race, chooses between a few', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('Logs in and performs user story for changing race', () => {
    cy.visit('http://it2810-20.idi.ntnu.no/project2/');

    cy.get('input#log-in-input').type('Cypress test user');
    cy.get('button').first().should('exist').should('have.text', 'Log in').click();
    cy.wait(2000);

    cy.get('a').contains('Race').click({ force: true });
    cy.wait(2000);

    cy.get('.card').should('have.length', 9);

    cy.get('.card')
      .eq(0)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Dragonborn');
        cy.get('p').should('contain', 'Size:');
        cy.get('p').should('contain', 'Speed:');
      });

    cy.get('.card')
      .eq(1)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Dwarf');
        cy.get('p').should('contain', 'Size:');
        cy.get('p').should('contain', 'Speed:');
      });

    cy.get('.card')
      .eq(2)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Elf');
        cy.get('p').should('contain', 'Size:');
        cy.get('p').should('contain', 'Speed:');
      });

    cy.get('.card')
      .eq(3)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Gnome');
        cy.get('p').should('contain', 'Size:');
        cy.get('p').should('contain', 'Speed:');
      });

    cy.get('.card')
      .eq(4)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Half-Elf');
        cy.get('p').should('contain', 'Size:');
        cy.get('p').should('contain', 'Speed:');
      });

    cy.get('.card')
      .eq(5)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Half-Orc');
        cy.get('p').should('contain', 'Size:');
        cy.get('p').should('contain', 'Speed:');
      });

    cy.get('.card')
      .eq(6)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Halfling');
        cy.get('p').should('contain', 'Size:');
        cy.get('p').should('contain', 'Speed:');
      });

    cy.get('.card')
      .eq(7)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Human');
        cy.get('p').should('contain', 'Size:');
        cy.get('p').should('contain', 'Speed:');
      });

    cy.get('.card')
      .eq(8)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Tiefling');
        cy.get('p').should('contain', 'Size:');
        cy.get('p').should('contain', 'Speed:');
      });

    cy.get('.card')
      .eq(2)
      .within(() => {
        cy.get('input[type="checkbox"]').click({ force: true });
      });
    cy.wait(1000);

    cy.get('.card')
      .eq(0)
      .within(() => {
        cy.get('input[type="checkbox"]').click({ force: true });
      });
  });
});
