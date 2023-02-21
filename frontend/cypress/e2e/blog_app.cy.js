/* eslint-disable quotes */
/* eslint-disable no-undef */
Cypress.Commands.add('createBlog', ({ title, author, url, likes }) => {
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: { title, author, url, likes },
    headers: {
      Authorization: `bearer ${JSON.parse(localStorage.getItem('loggedBlogAppUser')).token}`,
    },
  })

  cy.visit('http://localhost:3003')
})

Cypress.Commands.add('login', (username, password) => {
  cy.get('#username').type(username)
  cy.get('#password').type(password)
  cy.get('#login-button').click()
})

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Mikhail Dyachenko',
      username: 'Vasisualiy',
      password: 'IputThisEverywhere',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3003')
  })

  it('Login form is shown', function () {
    cy.contains('blog app')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.login('Vasisualiy', 'IputThisEverywhere')
      cy.contains('Mikhail Dyachenko logged in')
    })

    it('fails with wrong credentials', function () {
      cy.login('HrenSgori', 'UltrawiseDuck')

      cy.get('#notification')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.intercept('POST', '**/blogs').as('postBlogs')
      cy.intercept('GET', '**/blogs').as('getBlogs')
      cy.login('Vasisualiy', 'IputThisEverywhere')
      cy.contains('create blog').click()
      cy.get('#titleInput').type('Do good things and throw them in the sea...')
      cy.get('#authorInput').type('Armenian folklore')
      cy.get('#urlInput').type('https://www.youtube.com/watch?v=cR0ou0U3m2g')
      cy.get('#create-blog-button').click()
      cy.wait('@postBlogs')
      // cy.wait('@getBlogs')
    })

    it('A blog can be created', function () {
      cy.contains('Do good things and throw them in the sea... Armenian folklore')
    })

    it('A blog can be liked', function () {
      cy.get('.blog-item').contains('Do good things').click()
      cy.contains('like').click()
      cy.contains('1 likes')
    })

    it('A blog can be deleted by the user who created it', function () {
      cy.get('.blog-item').contains('Do good things').click()
      cy.contains('delete').click()
      cy.get('html').should(
        'not.contain',
        'Do good things and throw them in the sea... Armenian folklore',
      )
    })

    it('A blog cannot be deleted by the user who didn`t create it', function () {
      cy.contains('logout').click()
      const user = {
        name: 'Ilja Dyachenko',
        username: 'Flashus',
        password: 'ActuallyIDontKnow',
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)
      cy.login('Flashus', 'ActuallyIDontKnow')
      cy.get('.blog-item').contains('Do good things').click()
      cy.get('html').should(
        'not.contain',
        'delete',
      )
    })
  })
})
