describe('Logs user inn, views monsters, adds to dungeon', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('Performs user story', () => {
    cy.visit('http://localhost:5173/');
    cy.get('input').type('Cypress test user');
    cy.get('button').first().should('exist').should('have.text', 'Log in').click();

    cy.get('a').eq(2).should('have.text', 'Monsters').click();

    cy.get('input').type('Aboleth');

    cy.get('div').children('div').children('div').get('h2').should('exist').should('have.text', 'Aboleth');

    cy.get('div')
      .children('div')
      .children('div')
      .get('button')
      .eq(7)
      .then((button) => {
        if (button.text() === 'Add to dungeon') {
          cy.wrap(button).click();
        } else {
          cy.wrap(button).click();
          cy.wait(200);
          cy.wrap(button).click();
        }
      });

    cy.get('a').eq(3).should('have.text', 'Dungeon').click();
    cy.get('div').children('div').children('div').get('h2').should('exist').should('have.text', 'Aboleth');
  });
});
