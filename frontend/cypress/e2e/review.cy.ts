describe('Creates a review, then deletes it', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('Logs in', () => {
    cy.visit('http://localhost:5173/');

    cy.get('input#log-in-input').type('Cypress test user');
    cy.get('button').first().should('exist').should('have.text', 'Log in').click();
    cy.wait(2000);

    cy.get('a').contains('Monsters').click();

    cy.get('input[type="text"]').should('exist');

    cy.wait(1000);

    cy.get('input[type="text"]').clear({ force: true }).type('black pudding', { force: true });

    cy.get('input[type="text"]').should('have.value', 'black pudding');
    cy.wait(2000);
    cy.get('button').contains('Review').should('exist');
    cy.get('button').contains('Review').click();
    cy.wait(1000);

    cy.get('textarea').eq(0).clear().type('It was quite easy to defeat with friends, glad we did it!');

    cy.get('textarea').eq(0).should('have.value', 'It was quite easy to defeat with friends, glad we did it!');

    cy.get('button').eq(10).should('exist').should('have.text', 'SUBMIT').click();
    cy.wait(1000);

    cy.wait(2000);
    cy.get('button').contains('Review').should('exist');
    cy.get('button').contains('Review').click();
    cy.wait(1000);

    cy.get('textarea').eq(0).clear().type('I lied, we struggled a lot!');

    cy.get('textarea').eq(0).should('have.value', 'I lied, we struggled a lot!');

    cy.get('button').contains('UPDATE').should('exist').click();
    cy.wait(1000);
    cy.get('h2').contains('Black Pudding').click();
    cy.wait(1000);
    cy.get('button').eq(11).should('exist').click();
    cy.wait(1000);
    cy.get('textarea').eq(0).clear().type('This time it was better! Huzzah!');
    cy.wait(1000);
    cy.get('textarea').eq(0).should('have.value', 'This time it was better! Huzzah!');
    cy.wait(1000);
    cy.get('button').eq(10).should('exist').click();
    cy.wait(2000);
    cy.get('button').eq(9).should('exist').click();
    cy.wait(1000);
    cy.get('button').eq(11).should('exist').click();
  });
});
