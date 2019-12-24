const title = 'Guyana Party'

module.exports = {
  siteMetadata: {
    title,
    titleTemplate: `%s | ${title}`,
    description:
      'Gestion des évènements et mise en avant des activités des associations et des acteurs locaux en Guyane.',
    author: '@chrisservius',
    keywords: ['guyane', 'carte', 'évènement', 'sortie', 'liberté']
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-react-leaflet',
    {
      resolve: 'gatsby-plugin-create-client-paths',
      options: { prefixes: ['/app/*', '/group/*', '/event/*'] }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: title,
        short_name: 'Guyane',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'standalone',
        icon: 'src/images/favicon.png' // This path is relative to the root of the site.
      }
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // or https://www.gatsbyjs.org/docs/add-offline-support-with-a-service-worker/
    // 'gatsby-plugin-offline'
  ]
}
