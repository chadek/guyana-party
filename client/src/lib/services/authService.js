import React, { useEffect, useState, useContext, createContext } from 'react'
import PropTypes from 'prop-types'
import { navigate } from '@reach/router'
import axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie'
import { gravatar, MISSING_TOKEN_ERR, reload, getUID, getToken, axiosPut } from '../utils'

function useProvideAuth() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  const formatError = error => {
    if (error) setError(error)
    setLoading(false)
  }

  useEffect(() => {
    if (user) return setLoading(false)

    const { jwt, uid } = getToken()
    if (!jwt || !uid) return formatError(MISSING_TOKEN_ERR)

    axios({
      method: 'GET',
      headers: { authorization: `bearer ${jwt}` },
      url: `${process.env.API}/users/${uid}`
    })
      .then(({ data: res }) => {
        if (res.status !== 200 || !res.data) {
          return formatError('Une erreur interne est survenue')
        }
        res.data.photo = res.data.photo ? `${process.env.STATIC}/${res.data.photo}` : gravatar(res.data.email)
        setUser(res.data)
      })
      .catch(error => formatError(error))
      .finally(() => formatError())
  }, [user])

  const setNewUser = (newUser, token) => {
    const config = {
      expires: Number(process.env.COOKIE_EXPIRES),
      secure: process.env.NODE_ENV === 'production' // https required in prod
    }
    Cookies.set('gp_jwt', token, config)
    Cookies.set('gp_uid', newUser._id, config)
    newUser.photo = newUser.photo ? `${process.env.STATIC}/${newUser.photo}` : gravatar(newUser.email)
    setUser(newUser)
  }

  const updateUser = (payload, next, fallback) => {
    const uid = getUID()
    if (!uid) return fallback(MISSING_TOKEN_ERR)
    const { name, email, photo } = payload
    const formData = new FormData()
    formData.append('name', name)
    if (email) formData.append('email', email)
    formData.append('files[]', photo)

    return axiosPut(
      { url: `${process.env.API}/users/${uid}`, data: formData },
      ({ data: res }) => {
        if (res && res.status === 200 && res.data) next()
        else fallback('Une erreur interne est survenue')
      },
      fallback
    )
  }

  const loginFacebook = (res, next, fallback) => {
    const { name, email } = res
    axios({
      method: 'POST',
      data: qs.stringify({ name, email, provider: 'facebook' }),
      url: `${process.env.API}/auth/login`
    })
      .then(({ data }) => {
        if (data.status !== 200 || !data.token || !data.user._id) {
          return fallback('Une erreur interne est survenue')
        }
        setNewUser(data.user, data.token)
        next()
      })
      .catch(fallback)
      .finally(() => setLoading(false))
  }

  const loginGoogle = ({ tokenId }, next, fallback) => {
    if (!tokenId) return fallback('Token id missing')

    axios({
      method: 'POST',
      data: qs.stringify({ tokenId, provider: 'google' }),
      url: `${process.env.API}/auth/login`
    })
      .then(({ data }) => {
        if (data.status !== 200 || !data.token || !data.user._id) {
          return fallback('Une erreur interne est survenue')
        }
        setNewUser(data.user, data.token)
        next()
      })
      .catch(fallback)
      .finally(() => setLoading(false))
  }

  const sendLinkEmail = (email, next, fallback) => {
    const linkHost = `${window.location.origin}/connexion`
    axios({
      method: 'POST',
      data: qs.stringify({ email, linkHost }),
      url: `${process.env.API}/auth/sendmail`
    })
      .then(({ data }) => {
        if (data.status !== 200) {
          return fallback('Une erreur interne est survenue')
        }
        next(data.provider)
      })
      .catch(fallback)
      .finally(() => setLoading(false))
  }

  const loginEmail = (token, next, fallback) => {
    if (!token) return fallback('Token missing')
    axios({
      method: 'POST',
      data: qs.stringify({ authLinkToken: token }),
      url: `${process.env.API}/auth/loginmail`
    })
      .then(({ data }) => {
        if (data.status !== 200 || !data.token || !data.user._id) {
          return fallback('Une erreur interne est survenue')
        }
        setNewUser(data.user, data.token)
        next()
      })
      .catch(fallback)
      .finally(() => setLoading(false))
  }

  const signEmail = ({ name, email, password }, next, fallback) => {
    axios({
      method: 'POST',
      data: qs.stringify({ name, email, password }),
      url: `${process.env.API}/auth/signup`
    })
      .then(({ data }) => {
        if (data.status !== 201) {
          return fallback('Une erreur interne est survenue')
        }
        next()
      })
      .catch(fallback)
      .finally(() => setLoading(false))
  }

  const signout = () => {
    navigate('/').then(() => {
      Cookies.remove('gp_jwt')
      Cookies.remove('gp_uid')
      setUser(null)
      reload()
    })
  }

  return {
    loading,
    error,
    user,
    updateUser,
    loginFacebook,
    loginGoogle,
    sendLinkEmail,
    loginEmail,
    signEmail,
    signout
  }
}

const authContext = createContext()

export const AuthProvider = ({ children }) => (
  <authContext.Provider value={useProvideAuth()}>{children}</authContext.Provider>
)

AuthProvider.propTypes = { children: PropTypes.node.isRequired }

export const useAuth = () => useContext(authContext)
