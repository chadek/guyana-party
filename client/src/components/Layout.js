import PropTypes from 'prop-types'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import '../lib/cookieconsent'
import Header from './Header'
import Snack from './Snack'
import './styles/layout.css'
import { Style, theme } from './styles/Style'

const Layout = ({ children, location: { pathname } }) => (
  <ThemeProvider theme={theme}>
    <>
      <Style />
      <Snack />
      <Header pathname={pathname} />
      <main>{children}</main>
    </>
  </ThemeProvider>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired
}

export default Layout
