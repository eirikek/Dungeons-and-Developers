describe('Chooses some equipment using the searchbar, after collecting the items removes them from inventory', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('Logs in', () => {
    cy.visit('http://localhost:5173/');

    cy.get('input#log-in-input').type('Cypress test user');
    cy.get('button').first().should('exist').should('have.text', 'Log in').click();
    cy.wait(2000);

    cy.get('a').contains('Equipment').click({ force: true });
    cy.wait(2000);

    cy.get('input[placeholder="Search for equipment..."]').clear().type('Blowgun');
    cy.get('button').contains('Search').click();
    cy.wait(2000);
    cy.get('h3').should('contain.text', 'BlowgunBlowgun needle');
    cy.get('h3').contains('Blowgun').parent().find('input[type="checkbox"]').check({ force: true });
    cy.get('h3').contains('Blowgun needle').parent().find('input[type="checkbox"]').check({ force: true });

    cy.wait(2000);
    cy.get('input[placeholder="Search for equipment..."]').clear().type("Burglar's pack");
    cy.get('button').contains('Search').click();
    cy.wait(2000);
    cy.get('h3').should('contain.text', "Burglar's Pack");
    cy.get('h3').contains("Burglar's Pack").parent().find('input[type="checkbox"]').check({ force: true });

    cy.get('input[placeholder="Search for equipment..."]').clear();
    cy.get('button').contains('Clear Search').click();
    cy.get('button').contains('Remove All Equipments').click();
  });
});
