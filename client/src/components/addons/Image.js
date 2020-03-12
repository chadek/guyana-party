import Proptypes from 'prop-types'
import React from 'react'
import defaultImg from '../../images/default.jpeg'

const Image = ({ alt, fallback, ...rest }) => (
  <img
    {...rest}
    alt={alt}
    onError={e => {
      e.target.src = fallback
    }}
  />
)

Image.propTypes = {
  alt: Proptypes.string,
  fallback: Proptypes.string
}

Image.defaultProps = {
  alt: 'Default alt for a11y',
  fallback: defaultImg
}

export default Image
