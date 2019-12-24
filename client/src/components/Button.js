import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.button`
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  color: rgb(255, 255, 255);
  cursor: pointer;
  box-sizing: border-box;
  position: relative;
  font-family: Montserrat, Helvetica, sans-serif;
  line-height: 1.4;
  font-size: 15px;
  min-height: 60px;
  background-color: rgb(73, 134, 248);
  width: 100%;
  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  border-image: initial;
  border-radius: 5px;
  outline: none;
  text-decoration: none;
  padding: 17px 50px;
  &:hover,
  &:focus {
    background-color: rgb(44, 114, 247);
  }
  &.facebook,
  &.google {
    background-position: 2rem;
    background-repeat: no-repeat;
    background-size: 20px;
  }
  &.facebook {
    background-color: rgb(59, 88, 151);
    &:hover,
    &:focus {
      background-color: rgb(66, 99, 169);
    }
  }
  &.google {
    background-color: #fff;
    color: #000;
    border: 1px solid #000;
    &:hover,
    &:focus {
      background-color: rgb(245, 245, 245);
    }
  }
`

const Button = ({ className, text, onClick, disabled }) => (
  <Wrapper aria-label={text} className={className || ''} disabled={disabled} onClick={onClick}>
    <span>{text}</span>
  </Wrapper>
)

Button.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
}

export default Button
