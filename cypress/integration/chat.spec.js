describe('chat', function () {
    beforeEach(() => {
        cy.visit('file:///home/adeolu/WebstormProjects/chat-app/cypress/fixtures/idealstate.html')
    });

    it('should receive a random username and room', function () {
        cy.get('#sidebar').should('exist');
        cy.get('div.room button').click();
        
        cy.get('#room-input').invoke('value').then(value => {
            assert.isNotEmpty(value);
        });
    });
});