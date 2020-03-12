import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress'

const Wrapper = styled.section`
  margin-top: 1rem;
  .progress {
    margin-top: 1rem;
  }
  .container {
    position: relative;
    width: 100%;
    max-width: 1170px;
    margin: 0 auto;
    padding: 0 1rem;
    .page-content h1 {
      text-align: center;
      font-size: 30px;
    }
  }
  @media screen and (max-width: ${({ theme }) => theme.sm}) {
    margin-top: 1rem;
    .container {
      padding: 0 0.5rem;
    }
  }
`

const Page = ({ children, className, loading }) => (
  <Wrapper className={className}>
    {loading && (
      <center className='progress'>
        <CircularProgress />
      </center>
    )}
    {!loading && (
      <div className='container'>
        <div className='page-content'>{children}</div>
      </div>
    )}
  </Wrapper>
)

Page.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  loading: PropTypes.bool
}

export default Page
