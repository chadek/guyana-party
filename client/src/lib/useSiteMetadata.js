import { useStaticQuery, graphql } from 'gatsby'

export default () => {
  const { site } = useStaticQuery(
    graphql`
      query SiteMetaData {
        site {
          siteMetadata {
            title
            titleTemplate
            description
            author
            keywords
          }
        }
      }
    `
  )
  return site.siteMetadata
}
