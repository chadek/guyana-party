import React from 'react'
import PropTypes from 'prop-types'
import { Link as GatsbyLink } from 'gatsby'

function Link({ children, to, blank, noprefetch, ...other }) {
  const A = blank ? (
    <a
      aria-label={`${to} (s’ouvre dans un nouvel onglet)`}
      href={to}
      rel='noreferrer noopener nofollow'
      target='_blank'
      {...other}
    >
      {children}
    </a>
  ) : (
    <a href={to} {...other}>
      {children}
    </a>
  )

  // Tailor the following test to your environment.
  // This example assumes that any internal link (intended for Gatsby)
  // will start with exactly one slash, and that anything else is external.
  const internal = /^\/(?!\/)/.test(to)

  // Use Gatsby Link for internal links, and <a> for others
  if (internal) {
    const file = /\.[0-9a-z]+$/i.test(to)
    if (file || noprefetch) return A

    return (
      <GatsbyLink to={to} {...other}>
        {children}
      </GatsbyLink>
    )
  }
  return A
}

Link.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
  blank: PropTypes.bool
}

export default Link
