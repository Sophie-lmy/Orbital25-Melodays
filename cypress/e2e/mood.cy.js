describe('Mood Recommendation', () => {
  it('should recommend a song based on selected mood', () => {
    cy.login(); 
    cy.visit('/mood');
    cy.contains('Happy').click();
    cy.url().should('include', '/music-player');
    cy.contains('Listen on Spotify');
  });
});
