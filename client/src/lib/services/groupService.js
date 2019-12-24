import { useEffect, useState } from 'react'
import {
  axiosGet,
  axiosPost,
  axiosPut,
  axiosDelete,
  fetcher,
  getUID,
  formatResult,
  MISSING_TOKEN_ERR
} from '../utils'
import useSWR from 'swr'

export const createGroup = (payload, next, fallback) => {
  const uid = getUID()
  if (!uid) return fallback(MISSING_TOKEN_ERR)

  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('description', payload.description)
  formData.append('author', uid)
  payload.photos = payload.photos || []
  payload.photos.forEach(photo => formData.append('files[]', photo))

  axiosPost(
    { url: `${process.env.API}/groups`, data: formData },
    ({ data: res }) => {
      if (res.status === 201 && res.data) {
        next({ slug: res.data.slug, _id: res.data._id })
      } else fallback('Une erreur interne est survenue')
    },
    fallback
  )
}

export const updateGroup = (payload, next, fallback) => {
  if (!payload.id) fallback()
  if (!getUID()) return fallback(MISSING_TOKEN_ERR)

  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('description', payload.description)
  payload.photos.forEach(photo => {
    if (!photo.size) formData.append('photos[]', photo.name)
    else formData.append('files[]', photo)
  })

  axiosPut(
    { url: `${process.env.API}/groups/${payload.id}`, data: formData },
    ({ data: res }) => {
      if (res.status === 200 && res.data) next({})
      else fallback('Une erreur interne est survenue')
    },
    fallback
  )
}

export const archiveGroup = (id, next, fallback) => {
  if (!getUID()) return fallback(MISSING_TOKEN_ERR)

  axiosPut(
    { url: `${process.env.API}/groups/${id}`, data: { status: 'archived' } },
    ({ data: res }) => {
      if (res.status === 200 && res.data) next()
      else fallback('Une erreur interne est survenue')
    },
    fallback
  )
}

export const removeGroup = (id, next, fallback) => {
  if (!getUID()) return fallback(MISSING_TOKEN_ERR)

  axiosDelete(
    `${process.env.API}/groups/${id}`,
    ({ data: res }) => {
      if (res.status === 200 && res.data) next()
      else fallback('Une erreur interne est survenue')
    },
    fallback
  )
}

export const useGroup = ({ id, slug }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [group, setGroup] = useState(null)

  useEffect(() => {
    if ((!id && !slug) || group) return setLoading(false)
    axiosGet(
      `${process.env.API}/groups${slug ? `?slug=${slug}` : `/${id}`}`,
      ({ data: res }) => {
        if (res.status !== 200 || !res.data) {
          return formatError('Une erreur interne est survenue')
        }
        const parsePhoto = p => {
          return { preview: `${process.env.STATIC}/${p}`, name: p }
        }
        if (slug) {
          res.data[0].photos = res.data[0].photos.map(parsePhoto)
          res.data = res.data[0]
        } else {
          res.data.photos = res.data.photos.map(parsePhoto)
        }
        setGroup(res.data)
      },
      formatError
    ).finally(formatError)
  }, [group, id, slug])

  const formatError = error => {
    if (error) setError(error)
    setLoading(false)
  }

  return { loading, error, group }
}

export const useGroups = (onlyAdmin = false) => {
  const [groups, setGroups] = useState([])

  let uid = getUID()
  uid = uid ? `&uid=${uid}` : ''

  const { data, error, isValidating: loading } = useSWR(
    `${process.env.API}/groups?status=online${onlyAdmin ? '&admin=true' : ''}${uid}`,
    fetcher
  )

  useEffect(() => {
    if (!error && data && data.total > 0) setGroups(formatResult(data.data))
  }, [data, error])

  return { loading, error, groups }
}

export const useArchived = () => {
  const [groups, setGroups] = useState([])

  const { data, error, isValidating: loading } = useSWR(
    `${process.env.API}/groups?author=${getUID()}&status=archived`,
    fetcher
  )

  useEffect(() => {
    if (!error && data && data.total > 0) setGroups(formatResult(data.data))
  }, [data, error])

  return { loading, error, groups }
}
