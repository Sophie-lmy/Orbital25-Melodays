describe('User Login', () => {
  it('should log in and redirect to Home page', () => {
    cy.visit('https://melodays-frontend.vercel.app/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Wait for redirect and check homepage content
    cy.url().should('include', '/home');
    cy.contains('Welcome to'); 
  });
});
