import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from '../addons/Link'

const Wrapper = styled.div`
  a.nav {
    display: inline-block;
    padding: 0 8px;
  }
  .sub {
    height: ${props => props.theme.headerHeight};
    border-bottom: 2px solid transparent;
    &:hover {
      border-bottom-color: ${props => props.theme.black};
    }
    span {
      padding: 8px;
    }
  }
  @media screen and (max-width: ${({ theme }) => theme.xs}), (max-height: ${({ theme }) => theme.xs}) {
    .sub {
      height: ${({ theme }) => theme.headerXSHeight};
    }
  }
`

const LinkMenu = ({ name, to }) => (
  <Wrapper>
    <Link className="nav" to={to}>
      <div className="sub grid">
        <span>{name}</span>
      </div>
    </Link>
  </Wrapper>
)

LinkMenu.propTypes = {
  name: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
}

export default LinkMenu
