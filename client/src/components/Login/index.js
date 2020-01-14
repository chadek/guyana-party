import React, { useState } from 'react'
import { navigate } from 'gatsby'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login'
import isEmail from 'validator/lib/isEmail'
import { FormWrapper, LoginWrapper as Wrapper, OrDivWrapper } from './LoginStyles'
import LoginEmail from './LoginEmail'
import { If } from '../addons'
import Button from '../Button'
import { showSnack } from '../Snack'
import { useAuth } from '../../lib/services/authService'

function Login() {
  const [email, setEmail] = useState('christopherservius@gmail.com')
  // const [password, setPassword] = useState('')
  const [emailOk, setEmailOk] = useState(false)
  const [emailError, setEmailError] = useState('')
  // const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState(null)

  const { loading: initializing, user, loginFacebook, loginGoogle, sendLinkEmail } = useAuth()

  const fbHandle = res => {
    setLoading(true)
    loginFacebook(
      res,
      () => navigate('/app'),
      error => {
        setLoading(false)
        showSnack('La connexion a echoué !', 'error')
        console.error(error)
      }
    )
  }

  const googleHandle = res => {
    if (res.error) {
      console.error(res)
      return showSnack('Une erreur interner est survenue !', 'error')
    }
    setLoading(true)
    loginGoogle(
      res,
      () => navigate('/app'),
      error => {
        setLoading(false)
        showSnack('La connexion a echoué !', 'error')
        console.error(error)
      }
    )
  }

  const FacebookBtn = () => (
    <FacebookLogin
      appId={process.env.FACEBOOK_APP_ID}
      callback={fbHandle}
      fields='name,email'
      render={({ onClick, disabled }) => (
        <Button
          className='facebook fb_bg'
          disabled={loading || disabled}
          onClick={onClick}
          text='Connexion avec Facebook'
        />
      )}
    />
  )

  const GoogleBtn = () => (
    <GoogleLogin
      clientId={process.env.GOOGLE_APP_ID}
      cookiePolicy='single_host_origin'
      onFailure={googleHandle}
      onSuccess={googleHandle}
      render={({ onClick, disabled }) => (
        <Button
          className='google g_bg'
          disabled={loading || disabled}
          onClick={onClick}
          text='Connexion avec Google'
        />
      )}
    />
  )

  const checkEmail = value => {
    setEmailError('')
    if (!value) return setEmailError('Saisissez votre adresse e-mail pour continuer')
    if (!isEmail(value)) return setEmailError("L'email est invalide")
  }

  // const checkPassword = value => {
  //   setPasswordError('')
  //   if (!value) return setPasswordError('Le mot de passe est requis')
  //   if (value.length < 8) {
  //     return setPasswordError('Le mot de passe doit comporter au moins 8 caractères')
  //   }
  //   return true
  // }

  const sendEmail = () => {
    setLoading(true)
    sendLinkEmail(
      email,
      p => {
        if (p) setProvider(p)
        setLoading(false)
      },
      err => {
        console.log(err)
        setLoading(false)
      }
    )
  }

  const validate = e => {
    e.preventDefault()
    checkEmail(email)
    if (!emailOk && email && !emailError) {
      setEmailOk(true)
      sendEmail()
    }
    // else if (emailOk) {
    //   setPasswordError('')
    //   if (!checkPassword(password)) return
    //   setLoading(true)
    //   loginEmail(
    //     { email, password },
    //     () => {
    //       const redirect = typeof window !== 'undefined' && window.location.search.split('=')[1]
    //       if (redirect) return navigate(redirect)
    //       navigate('/app')
    //     },
    //     error => {
    //       setLoading(false)
    //       setPassword('')
    //       showSnack('La connexion a echoué !', 'error')
    //       console.log(error)
    //     }
    //   )
    // }
  }

  return (
    <Wrapper>
      <h1>Connexion</h1>
      <If
        condition={!initializing && !user}
        otherwise={!initializing && user && <p className='center'>Vous êtes déjà connecté(e).</p>}
      >
        <div className='content'>
          {(emailOk && (
            <LoginEmail
              email={email}
              FacebookBtn={FacebookBtn}
              goBack={() => setEmailOk(false)}
              GoogleBtn={GoogleBtn}
              loading={loading}
              provider={provider}
              sendEmail={sendEmail}
            />
          )) || (
            <>
              <FacebookBtn />
              <GoogleBtn />
              <OrDivWrapper className='or-div'>
                <div />
                <span>ou</span>
                <div />
              </OrDivWrapper>
              <FormWrapper>
                <div className={`email-section ${emailError ? 'error' : ''}`}>
                  <label htmlFor='email'>{emailError || 'Email'}</label>
                  <input
                    disabled={loading}
                    id='email'
                    onBlur={e => checkEmail(e.target.value)}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='exemple@email.com'
                    type='email'
                    value={email}
                  />
                </div>
                {/* <If condition={emailOk}>
                <div className={`pass-section ${passwordError ? 'error' : ''}`}>
                  <label htmlFor='password'>{passwordError || 'Mot de passe'}</label>
                  <input
                    disabled={loading}
                    id='password'
                    onBlur={e => checkPassword(e.target.value)}
                    onChange={e => setPassword(e.target.value)}
                    type='password'
                    value={password}
                  />
                </div>
              </If> */}
                <Button
                  disabled={loading}
                  onClick={validate}
                  // text={emailOk ? (loading ? 'Connexion...' : 'Se connecter') : 'Suivant'}
                  text='Suivant'
                />
              </FormWrapper>
            </>
          )}
        </div>
        {/* <p className='signup-link center'>
            <Link to='/signup'>Vous n&rsquo;avez pas de compte ?</Link>
          </p> */}
        <div className='copy center'>© GuyanaParty</div>
      </If>
    </Wrapper>
  )
}

export default Login
