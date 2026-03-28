describe('Home page', () => {
  it('should show home page', () => {
    cy.visit('/')
    cy.contains('Home')
  })
})