describe('Logs user inn, views monsters, adds to dungeon', () => {
  beforeEach(() => {
    // Set viewport to desktop size
    cy.viewport(1280, 720);
  });

  it('logs in', () => {
    /*
      As a user, I wish to login to the app, view monsters. And add a monster to my dungeon
     */

    // Log in
    cy.visit('http://localhost:5173/');
    cy.get('input').type('Cypress test user');
    cy.get('button').first().should('exist').should('have.text', 'Log in').click();

    // Navigates to monster page
    cy.get('a').eq(2).should('have.text', 'Monsters').click();

    // Search for monster
    cy.get('input').type('Aboleth');

    // Make sure monster exists
    cy.get('div').children('div').children('div').get('h2').should('exist').should('have.text', 'Aboleth');

    // Add monster to dungeon
    // Check if the button text is "Add to dungeon" and click it if true
    cy.get('div')
      .children('div')
      .children('div')
      .get('button')
      .eq(6)
      .then((button) => {
        // conditional click, if monster already added to dungeon or not
        if (button.text() === 'Add to dungeon') {
          cy.wrap(button).click();
        } else {
          cy.wrap(button).click();
          cy.wait(200);
          cy.wrap(button).click();
        }
      });

    // TODO: Check monster successfully added to page, apply filtering to monstersearch
  });
});
