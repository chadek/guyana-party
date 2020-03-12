import React from 'react'
import PropTypes from 'prop-types'
import { render } from 'enzyme'

import { ThemeProvider } from 'styled-components'
import { theme, Style } from '../components/styles/Style'

const AllTheProviders = ({ children }) => (
  <ThemeProvider theme={theme}>
    <>
      <Style />
      {children}
    </>
  </ThemeProvider>
)

AllTheProviders.propTypes = {
  children: PropTypes.node.isRequired
}

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
// export * from 'enzyme'
export { shallow } from 'enzyme'
export { expect } from 'chai'

// override render method
export { customRender as render }
