import React, { useEffect } from 'react'
import { navigate } from 'gatsby'
import { Router } from '@reach/router'
import EventPage from '../components/EventPage'

const Forbidden = () => {
  useEffect(() => navigate('/'), [])
  return null
}

export default () => (
  <Router>
    <Forbidden path='/event/*' />
    <EventPage path='/event/:slug' />
  </Router>
)
