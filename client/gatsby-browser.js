/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from 'react'
import { AuthProvider } from './src/lib/services/authService'
import Layout from './src/components/Layout'

export const wrapRootElement = ({ element }) => <AuthProvider>{element}</AuthProvider>

export const wrapPageElement = ({ element, props }) => <Layout {...props}>{element}</Layout>

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm('Cette application a été mise à jour. Voulez-vous recharger la page ?')
  if (answer === true) window.location.reload()
}
