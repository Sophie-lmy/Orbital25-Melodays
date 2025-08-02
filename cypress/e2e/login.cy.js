describe('User Login', () => {
  it('should log in and redirect to Home page', () => {
    cy.visit('https://melodays-frontend.vercel.app');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Wait for redirect and check homepage content
    cy.url().should('include', '/home');
    cy.contains('Welcome to', 'A personalized, emotional music discovery platform.', 'Feel the Vibe', 'Activity Beats', 'Song of the Day', 'Let Music Answer', 'Music Log', 'My Playlist', 'My Summary'); 
  });
});
