import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import useSiteMetadata from '../../lib/useSiteMetadata'

function Seo({ description, keywords, lang, meta, title }) {
  const siteMetadata = useSiteMetadata()

  const seo = {
    title: title || siteMetadata.title,
    description: description || siteMetadata.description,
    keywords: keywords || siteMetadata.keywords.join(', ')
  }

  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      meta={[
        {
          name: 'description',
          content: seo.description
        },
        {
          name: 'keywords',
          content: seo.keywords
        },
        {
          property: 'og:title',
          content: seo.title
        },
        {
          property: 'og:description',
          content: seo.description
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:creator',
          content: siteMetadata.author
        },
        {
          name: 'twitter:title',
          content: seo.title
        },
        {
          name: 'twitter:description',
          content: seo.description
        }
      ].concat(meta)}
      title={seo.title}
      titleTemplate={siteMetadata.titleTemplate}
    />
  )
}

Seo.defaultProps = {
  lang: 'fr',
  meta: []
}

Seo.propTypes = {
  description: PropTypes.string,
  keywords: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired
}

export default Seo
