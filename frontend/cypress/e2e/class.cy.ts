describe('Updates Class, chooses between a few', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('Logs in and performs user story for changing classes.', () => {
    cy.visit('http://it2810-20.idi.ntnu.no/project2/');

    cy.get('input#log-in-input').type('Cypress test user');
    cy.get('button').first().should('exist').should('have.text', 'Log in').click();
    cy.wait(2000);

    cy.get('a').contains('Class').click({ force: true });
    cy.wait(2000);

    cy.get('.card').should('have.length', 12);
    cy.get('.card')
      .eq(0)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Barbarian');
        cy.get('p').should('contain', 'HP:');
        cy.get('p').should('contain', 'Skills:');
      });
    cy.get('.card')
      .eq(1)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Bard');
        cy.get('p').should('contain', 'HP:');
        cy.get('p').should('contain', 'Skills:');
      });
    cy.get('.card')
      .eq(2)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Cleric');
        cy.get('p').should('contain', 'HP:');
        cy.get('p').should('contain', 'Skills:');
      });
    cy.get('.card')
      .eq(3)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Druid');
        cy.get('p').should('contain', 'HP:');
        cy.get('p').should('contain', 'Skills:');
      });
    cy.get('.card')
      .eq(4)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Fighter');
        cy.get('p').should('contain', 'HP:');
        cy.get('p').should('contain', 'Skills:');
      });
    cy.get('.card')
      .eq(5)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Monk');
        cy.get('p').should('contain', 'HP:');
        cy.get('p').should('contain', 'Skills:');
      });
    cy.get('.card')
      .eq(6)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Paladin');
        cy.get('p').should('contain', 'HP:');
        cy.get('p').should('contain', 'Skills:');
      });
    cy.get('.card')
      .eq(7)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Ranger');
        cy.get('p').should('contain', 'HP:');
        cy.get('p').should('contain', 'Skills:');
      });
    cy.get('.card')
      .eq(8)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Rogue');
        cy.get('p').should('contain', 'HP:');
        cy.get('p').should('contain', 'Skills:');
      });
    cy.get('.card')
      .eq(9)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Sorcerer');
        cy.get('p').should('contain', 'HP:');
        cy.get('p').should('contain', 'Skills:');
      });
    cy.get('.card')
      .eq(10)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Warlock');
        cy.get('p').should('contain', 'HP:');
        cy.get('p').should('contain', 'Skills:');
      });
    cy.get('.card')
      .eq(11)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Wizard');
        cy.get('p').should('contain', 'HP:');
        cy.get('p').should('contain', 'Skills:');
      });

    cy.get('.card')
      .eq(11)
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
