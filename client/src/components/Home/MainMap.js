import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Map from '../Map'

import { requestMarkers } from '../../lib/services/eventService'

const MainMap = ({ setMarkers, onMarkerClick, setActions, setLoading }) => {
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (!map) {
      const newMap = new Map(true)
      newMap.initMarkers({ requestMarkers, setMarkers, onMarkerClick, setLoading })
      setActions(newMap.actions)
      setMap(newMap)
    }
  }, [map, onMarkerClick, setActions, setLoading, setMarkers])

  return <div id='map' />
}

MainMap.propTypes = {
  setMarkers: PropTypes.func,
  onMarkerClick: PropTypes.func,
  setActions: PropTypes.func,
  setLoading: PropTypes.func
}

export default MainMap
