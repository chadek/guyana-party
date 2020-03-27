import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress'
import Logo from './Logo'
import LinkMenu from './LinkMenu'
import UserMenu from './UserMenu'
import { If, Link, Image } from '../addons'
import { useAuth } from '../../lib/services/authService'

const Wrapper = styled.header`
  position: sticky;
  top: 0;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 0 24px 0 12px;
  width: 100%;
  height: ${({ theme }) => theme.headerHeight};
  background-color: rgba(255, 255, 255, 0.3);
  transition: background-color 0.4s ease !important;
  z-index: 1001;
  border-bottom: 1px solid ${props => props.theme.borderColor} !important;
  &.opaque {
    background-color: #fff;
  }
  nav {
    &.logo {
      a {
        display: block;
        .gatsby-image-wrapper {
          vertical-align: middle;
          border-radius: 50%;
        }
      }
    }
    &.navs {
      justify-self: end;
      input {
        width: 120px;
        margin-right: 16px;
        padding-left: 40px;
        border-color: transparent;
        border-radius: 4px;
        background-color: rgb(239, 239, 239);
        background-position: 5px;
        background-size: 20px;
        transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        &:focus {
          width: 200px;
        }
      }
    }
    &.profile {
      img {
        width: 36px;
        height: 36px;
        cursor: pointer;
        border-radius: 50%;
      }
    }
  }
`

function scrollEffect(pathname, setScrollDown) {
  if (pathname.match(/^\/+$/)) {
    let down = false
    window.addEventListener(
      'scroll',
      () => {
        if (!down && window.scrollY > 0) {
          down = true
          setScrollDown(true)
        } else if (down && window.scrollY === 0) {
          down = false
          setScrollDown(false)
        }
      },
      { passive: true }
    )
  }
}

function opaqueEffect(pathname, scrollDown, setMainClass) {
  const opaque = !pathname.match(/^\/+$/) || scrollDown ? 'opaque' : ''
  const app = pathname.match('app') ? ' app' : ''
  setMainClass(opaque + app)
}

function Header({ pathname }) {
  const [mainClass, setMainClass] = useState('')
  const [scrollDown, setScrollDown] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const { loading, user, signout } = useAuth()

  useEffect(() => scrollEffect(pathname, setScrollDown), [pathname])

  useEffect(() => opaqueEffect(pathname, scrollDown, setMainClass), [pathname, scrollDown])

  return (
    <Wrapper className={`grid ${mainClass}`}>
      <nav className="logo">
        <Link className="nav" to="/">
          <Logo />
        </Link>
      </nav>
      <nav className="navs">
        <If condition={!!pathname.match(/^\/+$/)}>
          <input aria-label="filtrer" className="bg search_bg" placeholder="Filtrer..." type="search" />
        </If>
      </nav>
      <nav className="profile flex">
        <If condition={!pathname.match('connexion') && !loading && !user}>
          <LinkMenu name="Connexion" to="/connexion" />
        </If>
        {loading && !user && <CircularProgress size={36} />}
        {user && (
          <>
            <Image alt="Profile" onClick={() => setUserMenuOpen(!userMenuOpen)} src={user.photo} />
            <UserMenu
              anchor={typeof document !== 'undefined' && document.querySelector('.profile img')}
              hide={() => setUserMenuOpen(false)}
              isOpen={userMenuOpen}
              pathname={pathname}
              signout={signout}
              user={user}
            />
          </>
        )}
      </nav>
    </Wrapper>
  )
}

Header.propTypes = { pathname: PropTypes.string.isRequired }

export default Header
