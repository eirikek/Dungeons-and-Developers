//ChatGPt was used here for the logic of triggering of the counter. Covers the entire page.
describe('Updates ability score, increments and decrements', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('Logs in and performs user story for changing and adjusting ability score', () => {
    cy.visit('http://it2810-20.idi.ntnu.no/project2/');

    cy.get('input#log-in-input').type('Cypress test user');
    cy.get('button').first().should('exist').should('have.text', 'Log in').click();
    cy.wait(2000);

    cy.get('a').contains('Ability Scores').click({ force: true });
    cy.wait(2000);
    cy.get('.sub-header').should('contain.text', 'Charisma');
    cy.get('.sub-header').should('contain.text', 'Constitution');
    cy.get('.sub-header').should('contain.text', 'Dexterity');
    cy.get('.sub-header').should('contain.text', 'Intelligence');
    cy.get('.sub-header').should('contain.text', 'Wisdom');
    cy.get('.sub-header').should('contain.text', 'Strength');

    cy.get('button[aria-label="Increment"').should('exist');
    cy.get('button[aria-label="Decrement"').should('exist');
    let number1: number;
    let number3: number;
    let number2: number;
    cy.get('.sub-header').parent().should('exist');
    cy.get('.sub-header')
      .parent()
      .invoke('text')
      .then((text) => {
        number1 = parseInt(text);
        expect(number1).to.be.a('number');
      });

    cy.get('button[aria-label="Increment"]').each(($btn) => {
      cy.wrap($btn)
        .click({ force: true, multiple: true })
        .wait(1000)
        .trigger('mousedown', { force: true })
        .wait(1500)
        .trigger('mouseup', { force: true });
    });

    cy.get('.sub-header')
      .parent()
      .invoke('text')
      .then((text) => {
        number2 = parseInt(text);
        expect(number2).to.be.a('number');
      });

    cy.get('button[aria-label="Decrement"]').each(($btn) => {
      cy.wrap($btn)
        .click({ force: true, multiple: true })
        .wait(1000)
        .trigger('mousedown', { force: true })
        .wait(1500)
        .trigger('mouseup', { force: true });
    });

    cy.get('.sub-header')
      .parent()
      .invoke('text')
      .then((text) => {
        number3 = parseInt(text);
        expect(number3).to.be.a('number');
      });

    cy.wrap(null).then(() => {
      expect(number2).to.not.equal(number1);
      expect(number2).to.not.equal(number3);
    });
  });
});
