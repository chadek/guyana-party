import React, { useEffect } from 'react'
import { navigate } from 'gatsby'
import { Router } from '@reach/router'
import GroupPage from '../components/GroupPage'

const Forbidden = () => {
  useEffect(() => navigate('/'), [])
  return null
}

const group = () => (
  <Router>
    <Forbidden path='/group/*' />
    <GroupPage path='/group/:slug' />
  </Router>
)

export default group
