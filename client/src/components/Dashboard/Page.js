import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin-bottom: 1rem;
  .bg {
    display: table;
    background-size: cover;
    background-attachment: fixed;
    height: 100px;
    width: 100%;
    text-align: center;
    margin-bottom: 1rem;
    h1 {
      display: table-cell;
      vertical-align: middle;
      color: #fff;
      text-shadow: 0 1px 1px #000;
      font-weight: 500;
    }
  }
  .content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
  }
`

const Page = ({ title, children }) => (
  <Wrapper>
    <section className="bg banner_bg">
      <h1>{title}</h1>
    </section>
    <section className="content">{children}</section>
  </Wrapper>
)

Page.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default Page
