import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { isAdmin, isMember } from './communityService'
import { axiosGet, axiosPost, axiosPut, axiosDelete, fetcher, getUID, MISSING_TOKEN_ERR } from '../utils'

export const createEvent = (payload, next, fallback) => {
  try {
    const userId = getUID()
    if (!userId) return fallback(MISSING_TOKEN_ERR)

    const formData = new FormData()
    formData.append('name', payload.name)
    formData.append('group', payload.group)
    formData.append('description', payload.description)
    formData.append('timezone', payload.timezone)
    formData.append('startDate', payload.startDate)
    formData.append('endDate', payload.endDate)
    formData.append('occurrence', payload.occurrence)
    formData.append('location[address]', payload.location.address)
    formData.append('location[coordinates][0]', payload.location.coordinates[0])
    formData.append('location[coordinates][1]', payload.location.coordinates[1])
    formData.append('author', userId)
    payload.photos.forEach(photo => formData.append('files[]', photo))

    axiosPost(
      { url: `${process.env.API}/events`, data: formData },
      ({ data: res }) => {
        if (res && res.status === 201 && res.data) next(res.data.slug)
        else fallback('Une erreur interne est survenue')
      },
      fallback
    )
  } catch (error) {
    fallback(error)
  }
}

export const updateEvent = (payload, next, fallback) => {
  try {
    if (!payload.id) fallback()
    if (!getUID()) return fallback(MISSING_TOKEN_ERR)

    const formData = new FormData()
    formData.append('name', payload.name)
    formData.append('group', payload.group)
    formData.append('description', payload.description)
    formData.append('timezone', payload.timezone)
    formData.append('startDate', payload.startDate)
    formData.append('endDate', payload.endDate)
    formData.append('occurrence', payload.occurrence)
    formData.append('location.address', payload.location.address)
    formData.append('location.coordinates[0]', payload.location.coordinates[0])
    formData.append('location.coordinates[1]', payload.location.coordinates[1])
    payload.photos.forEach(photo => {
      if (photo.size) formData.append('files[]', photo)
      else formData.append('photos[]', photo)
    })

    axiosPut(
      { url: `${process.env.API}/events/${payload.id}`, data: formData },
      ({ data: res }) => {
        if (res && res.status === 200 && res.data) next()
        else fallback('Une erreur interne est survenue')
      },
      fallback
    )
  } catch (error) {
    fallback(error)
  }
}

export const archiveEvent = (id, next, fallback) => {
  if (!getUID()) return fallback(MISSING_TOKEN_ERR)

  axiosPut(
    { url: `${process.env.API}/events/${id}`, data: { status: 'archived' } },
    ({ data: res }) => {
      if (res && res.status === 200 && res.data) next()
      else fallback('Une erreur interne est survenue')
    },
    fallback
  )
}

export const removeEvent = (id, next, fallback) => {
  if (!getUID()) return fallback(MISSING_TOKEN_ERR)

  axiosDelete(
    `${process.env.API}/events/${id}`,
    ({ data: res }) => {
      if (res && res.status === 200 && res.data) next()
      else fallback('Une erreur interne est survenue')
    },
    fallback
  )
}

export const goPublic = (payload, next, fallback) => {
  if (!payload.id) fallback()
  if (!getUID()) return fallback(MISSING_TOKEN_ERR)

  axiosPut(
    { url: `${process.env.API}/events/${payload.id}`, data: { isPrivate: payload.cancel } },
    ({ data: res }) => {
      if (res && res.status === 200 && res.data) next()
      else fallback('Une erreur interne est survenue')
    },
    fallback
  )
}

export const publish = (payload, next, fallback) => {
  if (!payload.id) fallback()

  const uid = getUID()
  if (!uid) return fallback(MISSING_TOKEN_ERR)

  const data = { status: payload.cancel ? 'waiting' : 'online' }
  if (!payload.cancel) data.published = { date: Date.now(), user: uid }

  axiosPut(
    { url: `${process.env.API}/events/${payload.id}`, data },
    ({ data: res }) => {
      if (res && res.status === 200 && res.data) next()
      else fallback('Une erreur interne est survenue')
    },
    fallback
  )
}

export const requestMarkers = ({ search, box }, next, fallback) => {
  let uid = getUID()
  uid = uid ? `&uid=${uid}` : ''
  const [[sw1, sw2], [ne1, ne2]] = box
  axiosGet(
    `${process.env.API}/search?q=${search}${uid}&sort=startDate endDate&sw1=${sw1}&sw2=${sw2}&ne1=${ne1}&ne2=${ne2}`,
    ({ data: res }) => {
      if (!res || res.status !== 200 || !res.data) {
        return fallback('Une erreur interne est survenue')
      }
      next(res.data)
    },
    fallback
  )
}

export const useEvent = ({ id, slug }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [event, setEvent] = useState(null)

  const formatError = error => {
    if (error) setError(error)
    setLoading(false)
  }

  useEffect(() => {
    if ((!id && !slug) || event) return setLoading(false)
    axiosGet(
      `${process.env.API}/events${slug ? `?slug=${slug}` : `/${id}`}`,
      ({ data: res }) => {
        if (!res || res.status !== 200 || !res.data) {
          return formatError('Une erreur interne est survenue')
        }
        const { data } = res
        if (slug) setEvent(data[0])
        else setEvent(data)
      },
      formatError
    ).finally(formatError)
  }, [event, id, slug])

  return { loading, error, event }
}

export const useEvents = () => {
  const [events, setEvents] = useState([])

  let uid = getUID()
  uid = uid ? `&uid=${uid}` : ''

  const { data, error, isValidating: loading } = useSWR(`${process.env.API}/search?isapp=true${uid}`, fetcher)

  useEffect(() => {
    if (!error && data && data.total > 0) setEvents(data.data)
  }, [data, error])

  return { loading, error, events }
}

export const useEventsByGroup = group => {
  const [events, setEvents] = useState([])

  const getQuery = () => {
    let query = ''
    if (group && group._id) {
      query = `group=${group._id}`
      if (getUID()) {
        // We are connected, we check that we are admin
        if (!isAdmin(group.community)) {
          // We are not admin (perhaps member): we see only online
          query += '&status=online'
          if (!isMember(group.community)) {
            // We are not member: the event has to be public
            query += '&isPrivate=false'
          }
        } else query += '&status=waiting&status=online'
      } else {
        query = `${query}&status=online&isPrivate=false`
      }
      query = `${process.env.API}/events?${query}`
    }
    return query
  }

  const { data, error, isValidating: loading } = useSWR(getQuery(), fetcher)

  useEffect(() => {
    if (!error && data && data.total > 0) setEvents(data.data)
  }, [data, error])

  return { loading, error, events }
}

export const useArchived = () => {
  const [events, setEvents] = useState([])

  const { data, error, isValidating: loading } = useSWR(
    `${process.env.API}/events?author=${getUID()}&status=archived`,
    fetcher
  )

  useEffect(() => {
    if (!error && data && data.total > 0) setEvents(data.data)
  }, [data, error])

  return { loading, error, events }
}

export const allowedEvent = event => {
  const { group, status, isPrivate } = event
  if (isAdmin(group.community)) return true
  if (isMember(group.community)) return status === 'online'
  return status === 'online' && isPrivate === false
}

export const getAddressFromCoords = (coords, next, fallback) => {
  if (!coords || coords.length < 2) return next('')
  axiosGet(
    `https://nominatim.openstreetmap.org/reverse?format=json&lon=${coords[0]}&lat=${coords[1]}`,
    ({ data, status }) => {
      if (status === 200 && data) next(data.display_name)
      else fallback(new Error('Une erreur interne est survenue'))
    },
    fallback
  )
}
