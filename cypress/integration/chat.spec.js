describe('chat', function () {
    beforeEach(() => {
        cy.visit('http://localhost:3001')
    });

    it('should receive a random username and room and be able to chat', function () {
        cy.get('#sidebar').should('exist');
        cy.get('#room-input').should('have.value', '');

        cy.get('div.room button').click();

        cy.get('#room-input').should('not.have.value', '');

        cy.get('textarea').type('some text  {enter}');
        cy.get('.self').should('have.length', 1);
        cy.get('.self').contains('some text');
    });
});