describe('Character Creation: Updates Race, Class, and Equipment', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('Logs in, selects race, class, and equipment, then removes equipment', () => {
    cy.visit('http://it2810-20.idi.ntnu.no/project2//');

    cy.get('input#log-in-input').type('Cypress test user');
    cy.get('button').first().should('exist').should('have.text', 'Log in').click();
    cy.wait(2000);

    cy.get('a').contains('Race').click({ force: true });
    cy.wait(2000);

    cy.get('.card')
      .eq(0)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Dragonborn');
        cy.get('p').should('contain', 'Size:');
        cy.get('p').should('contain', 'Speed:');
      });

    cy.get('.card')
      .eq(6)
      .within(() => {
        cy.get('input[type="checkbox"]').check({ force: true });
      });

    cy.get('.card')
      .eq(6)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Halfling');
        cy.get('p').should('contain', 'Size:');
        cy.get('p').should('contain', 'Speed:');
      });

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
      .eq(11)
      .within(() => {
        cy.get('input[type="checkbox"]').check({ force: true });
      });

    cy.get('.card')
      .eq(11)
      .within(() => {
        cy.get('h2').should('exist').and('have.text', 'Wizard');
        cy.get('p').should('contain', 'HP:');
        cy.get('p').should('contain', 'Skills:');
      });

    cy.get('a').contains('Equipment').click({ force: true });
    cy.wait(2000);

    cy.get('input[placeholder="Search for equipment..."]').clear().type('Blowgun');
    cy.get('button').contains('Search').click();
    cy.get('h3').should('contain.text', 'BlowgunBlowgun needle');

    cy.wait(2000);
    cy.get('h3').contains('Blowgun').parent().find('input[type="checkbox"]').check({ force: true });
    cy.get('h3').contains('Blowgun needle').parent().find('input[type="checkbox"]').check({ force: true });

    cy.get('input[placeholder="Search for equipment..."]').clear().type("Burglar's pack");

    cy.get('button').contains('Search').click();
    cy.get('h3').should('contain.text', "Burglar's Pack");
    cy.wait(2000);
    cy.get('h3').contains("Burglar's Pack").parent().find('input[type="checkbox"]').check({ force: true });

    cy.get('input[placeholder="Search for equipment..."]').clear();
    cy.get('button').contains('Clear Search').click();

    cy.get('a').contains('Ability Scores').click({ force: true });
    cy.wait(2000);
    cy.get('button[aria-label="Increment"]').each(($btn) => {
      cy.wrap($btn)
        .click({ force: true, multiple: true })
        .wait(1000)
        .trigger('mousedown', { force: true })
        .wait(1500)
        .trigger('mouseup', { force: true });
    });

    cy.get('a').contains('My character').click({ force: true });
    cy.wait(2000);

    cy.get('.arrow-button').eq(0).click();
    cy.wait(1000);
    cy.get('.arrow-button').eq(0).click();
    cy.wait(1000);
    cy.get('.arrow-button').eq(0).click();
    cy.wait(1000);

    cy.get('.arrow-button').eq(1).click();
    cy.wait(1000);
    cy.get('.arrow-button').eq(1).click();
    cy.wait(2000);

    cy.get('.arrow-button').eq(3).click();
    cy.wait(1000);
    cy.get('.arrow-button').eq(3).click();
    cy.wait(1000);
    cy.get('.arrow-button').eq(3).click();
    cy.wait(1000);

    cy.get('.arrow-button').eq(2).click();
    cy.wait(2000);

    cy.get('button[aria-label="Decrement"]').each(($btn) => {
      cy.wrap($btn)
        .click({ force: true, multiple: true })
        .wait(1000)
        .trigger('mousedown', { force: true })
        .wait(1500)
        .trigger('mouseup', { force: true });
    });

    cy.get('.delete-icon').eq(0).click();
    cy.wait(1000);

    cy.get('.delete-icon').eq(0).click();
    cy.wait(1000);

    cy.get('.delete-icon').eq(0).click();
    cy.wait(1000);

    cy.get('div')
      .eq(0)
      .within(() => {
        cy.get('h3').should('exist').and('have.text', 'Half-OrcBard');
      });

    cy.get('.sub-header').contains('No equipments added').should('exist');
  });
});
