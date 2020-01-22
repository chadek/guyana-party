const React = require('react')

const gatsby = jest.requireActual('gatsby')

module.exports = {
  ...gatsby,
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(
    // these props are invalid for an `a` tag
    // ({ activeClassName, activeStyle, getProps, innerRef, ref, replace, to, ...rest }) =>
    ({ to, ...rest }) =>
      React.createElement('a', {
        ...rest,
        href: to
      })
  ),
  StaticQuery: jest.fn(),
  useStaticQuery: jest.fn().mockImplementation(() => ({
    site: {
      siteMetadata: {
        title: 'Site Title',
        description: 'Une description.',
        author: 'Christopher Servius',
        keywords: ['some', 'keywords']
      }
    }
  }))
}
