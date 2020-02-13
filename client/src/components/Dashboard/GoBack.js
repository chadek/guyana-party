import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from '../addons'

const Wrapper = styled.div`
  position: absolute;
  top: 8.5rem;
  left: 1rem;
  font-size: 0.9rem;
  z-index: 1;
`

const GoBack = ({ style }) => (
  <Wrapper style={style}>
    <Link title='Retourner au tableau de bord' to='/app'>
      ⬅ Tableau de bord
    </Link>
  </Wrapper>
)

GoBack.propTypes = { style: PropTypes.object }

export default GoBack
