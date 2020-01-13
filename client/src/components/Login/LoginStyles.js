import styled from 'styled-components'

export const LoginWrapper = styled.div`
  font-family: Montserrat, Helvetica, sans-serif;
  h1 {
    text-transform: uppercase;
  }
  .content {
    max-width: 390px;
    padding: 30px;
    border-radius: 5px;
    width: 100%;
    min-height: 260px;
    margin: 15px auto;
    background-color: #fff;
    color: ${props => props.theme.black};
    font-size: 15px;
    button.facebook {
      margin-bottom: 15px;
    }
  }
  /* .signup-link {
    margin-bottom: 60px;
    a {
      color: rgb(73, 134, 248);
      text-decoration: none;
      font-size: 15px;
    }
  } */
  .copy {
    font-size: 15px;
    height: 50px;
    line-height: 50px;
  }
  @media (max-width: ${props => props.theme.sm}) {
    .content {
      max-width: inherit;
      padding: 10px;
    }
    /* .signup-link {
      margin-bottom: 40px;
    } */
  }
`

export const OrDivWrapper = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  margin-top: 25px;
  div {
    background-color: rgb(235, 236, 239);
    height: 1px;
    flex: 1 1 0%;
  }
  span {
    margin: 0px 16px;
  }
`

export const FormWrapper = styled.form`
  margin: 0;
  font-size: 15px;
  .email-section,
  .pass-section {
    margin-top: 1rem;
  }
  input {
    position: relative;
    width: 100%;
    height: 50px;
    background-color: transparent;
    padding: 0 15px;
    border: 1px solid rgb(206, 210, 217);
    border-radius: 4px;
    font-size: 16px;
  }
  button {
    margin-top: 1rem;
  }
  .error {
    label {
      color: rgb(248, 99, 73);
      font-weight: 600;
    }
    input {
      background-color: rgb(254, 245, 231);
      border-color: rgb(248, 187, 73);
    }
  }
`

export const LoginEmailWrapper = styled.div`
  justify-content: center;
  h2 {
    font-size: 20px;
    font-weight: 500;
  }
  .email-sent-icon {
    background-image: url(https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/success_status.png);
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: 64px 64px;
    height: 64px;
    margin-bottom: 1rem;
  }
  ul,
  li {
    margin-bottom: 0;
  }
  .actions {
    grid-template-columns: auto auto;
    align-items: center;
    padding: 0.5rem 0;
    a:hover {
      text-decoration: underline;
    }
    a,
    button {
      color: ${props => props.theme.linkColor};
    }
    button {
      font-size: 14px;
    }
    .facebook,
    .google {
      margin: 1rem 0;
      color: #000;
    }
    .facebook {
      color: #fff;
    }
  }
`
