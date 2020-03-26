import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { Router } from '@reach/router'
import { useAuth } from '../lib/services/authService'
import { Seo } from '../components/addons'
import Dashboard from '../components/Dashboard'
import Profile from '../components/Dashboard/Profile'
import EditEvent from '../components/Dashboard/EditEvent'
import EditGroup from '../components/Dashboard/EditGroup'
import NotFound from './404'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { loading, user } = useAuth()

  useEffect(() => {
    if (!loading && !user) navigate('/connexion')
  }, [loading, user])

  return <Component {...rest} />
}

PrivateRoute.propTypes = {
  component: PropTypes.func
}

const app = () => (
  <>
    <Seo title="Tableau de bord" />
    <Router>
      <PrivateRoute component={Dashboard} path="/app" />
      <PrivateRoute component={NotFound} path="/app/*" />
      <PrivateRoute component={Profile} path="/app/profile" />
      <PrivateRoute component={EditEvent} path="/app/event/new" />
      <PrivateRoute component={EditEvent} path="/app/event/edit/:id" />
      <PrivateRoute component={EditGroup} path="/app/group/new" />
      <PrivateRoute component={EditGroup} path="/app/group/edit/:id" />
    </Router>
  </>
)

export default app
