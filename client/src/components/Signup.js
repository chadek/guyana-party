import { navigate } from 'gatsby'
import React, { useEffect, useState } from 'react'
import isEmail from 'validator/lib/isEmail'
import { useAuth } from '../lib/services/authService'
import { Link } from './addons'
import Button from './Button'
import { showSnack } from './Snack'
import { FormWrapper, LoginWrapper as Wrapper } from './Login/LoginStyles'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

  const { loading: initializing, user, signEmail } = useAuth()

  useEffect(() => {
    if (!initializing && user) navigate('/')
  }, [initializing, user])

  const checkName = value => {
    setNameError('')
    if (!value) return setNameError('Veuillez entrer votre nom')
    if (value.length < 5) {
      return setNameError('Le nom doit comporter au moins 5 caractères')
    }
    return true
  }

  const checkEmail = value => {
    setEmailError('')
    if (!value) return setEmailError('Veuillez entrer votre adresse email')
    if (!isEmail(value)) return setEmailError("L'email est invalide")
    return true
  }

  const checkPassword = value => {
    setPasswordError('')
    if (!value) return setPasswordError('Le mot de passe est requis')
    if (value.length < 8) {
      return setPasswordError('Le mot de passe doit comporter au moins 8 caractères')
    }
    return true
  }

  const validate = e => {
    e.preventDefault()
    setNameError('')
    setEmailError('')
    setPasswordError('')
    if (!checkName(name) || !checkEmail(email) || !checkPassword(password)) return
    setLoading(true)
    signEmail(
      { name, email, password },
      () => {
        showSnack('Votre compte est créé, veuillez vous connecter', 'success')
        navigate('/connexion')
      },
      error => {
        setLoading(false)
        setPassword('')
        showSnack('La création a echoué !', 'error')
        console.log(error)
      }
    )
  }

  return (
    <Wrapper>
      <h1>Créer un compte</h1>
      <div className='content'>
        <FormWrapper>
          <div className={nameError ? 'error' : ''}>
            <label htmlFor='name'>{nameError || 'Nom'}</label>
            <input
              disabled={loading}
              id='name'
              onBlur={e => checkName(e.target.value)}
              onChange={e => setName(e.target.value)}
              placeholder='Votre nom'
              type='text'
              value={name}
            />
          </div>
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
          <div className={`pass-section ${passwordError ? 'error' : ''}`}>
            <label htmlFor='password'>{passwordError || 'Mot de passe'}</label>
            <input
              disabled={loading}
              id='password'
              onChange={e => setPassword(e.target.value)}
              type='password'
              value={password}
            />
          </div>
          <Button
            disabled={loading}
            onClick={validate}
            text={loading ? 'Chargement...' : 'Créer un nouveau compte'}
          />
        </FormWrapper>
      </div>
      {!loading && (
        <p className='signup-link center'>
          <Link to='/connexion'>Vous avez déjà un compte ?</Link>
        </p>
      )}
      <div className='copy center'>© GuyanaParty</div>
    </Wrapper>
  )
}

export default Signup
