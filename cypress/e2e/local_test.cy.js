describe("Melodays Local Test Suite", () => {
  it("1) should load login page", () => {
    cy.visit("/");
    cy.contains("Email", "Password", "Log in"); 
  });

  it("2) should login and redirect to Home page", () => {
    cy.visit("/");
    cy.get('input[type="email"]').type("ciece0323@gmail.com");
    cy.get('input[type="password"]').type("555666");
    cy.get("button").contains("Log in").click();

    cy.url().should("include", "/home");
    cy.contains("Welcome to", "A personalized, emotional music discovery platform.", "Feel the Vibe", "Activity Beats", "Song of the Day", "Let Music Answer", "Music Log", "My Playlist", "My Summary");
  });

  it("3) should access mood page and get a song", () => {
    cy.visit("/mood");
    cy.contains("Nostalgic").click(); 
    cy.url().should("include", "/player");
    cy.contains("Listen on Spotify");
    cy.get('.spotify-link')
      .should('have.attr', 'href')
      .and('include', 'open.spotify.com');
  });

  it("4) should access activity page and get a song", () => {
    cy.visit("/activity");
    cy.contains("Focusing").click(); 
    cy.url().should("include", "/player");
    cy.contains("Listen on Spotify");
    cy.get('.spotify-link')
      .should('have.attr', 'href')
      .and('include', 'open.spotify.com');
  });

  it("5) should access daily and get a song", () => {
    cy.visit("/daily");
    cy.contains("Listen on Spotify");
    cy.get('.spotify-link')
      .should('have.attr', 'href')
      .and('include', 'open.spotify.com');
  });

  it("6) should access fortune page to get a song", () => {
    cy.visit("/fortune");
    cy.get(".tarot-card").eq(0).click(); // click 1st card
    cy.url().should("include", "/ask");
    cy.get("textarea").type("Will I find true love?");
    cy.contains("The universe responds...").click();
    cy.url().should("include", "/fortune-player");
    cy.contains("Listen on Spotify");
    cy.get('.spotify-link')
      .should('have.attr', 'href')
      .and('include', 'open.spotify.com');
  });

  it("7) should like a song and find it in My Playlist", () => {
    cy.visit("/mood");
    cy.contains("Nostalgic").click(); 
    cy.url().should("include", "/player");

    cy.get('.control-button').click(); // like song

    cy.visit("/playlist");
    cy.contains("ciece0323");
    cy.get('.songtitle').should('exist');
    cy.get('.playlist-link')
      .should('have.attr', 'href')
      .and('include', 'open.spotify.com');
  });

  it("8) should open music history and write a diary note", () => {
    cy.visit("/music-history");
    cy.get(".details-button").first().click(); // selects the first button
    cy.get("textarea").type("This song made me cry");
    cy.get("button").contains("Save Note").click();
    cy.contains("Back to History").click();
    cy.contains("This song made me cry");
  });

  it("9) should display summary charts", () => {
    cy.visit("/summary");
    cy.get("canvas").should("have.length", 3); // 3 charts expected
  });
});
