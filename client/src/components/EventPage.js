import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import styled from 'styled-components'
import Fab from '@material-ui/core/Fab'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from './Dialog'
import { If, Page, Link, Seo } from './addons'
import { showSnack } from './Snack'
import { useEvent, archiveEvent, allowedEvent } from '../lib/services/eventService'
import { isAdmin } from '../lib/services/communityService'
import SingleMap from './Dashboard/SingleMap'
import { markToSafeHTML } from '../lib/utils'
import { formatStart, formatPlage, days } from '../lib/date'
import PhotoList from './PhotoList'

const Wrapper = styled.div`
  #map,
  #mobileMap {
    height: 250px;
  }
  #mobileMap {
    display: none;
  }
  #title {
    position: absolute;
    margin-top: -225px;
    max-width: 500px;
    background-color: rgb(250, 250, 250);
    padding: 0.5rem 0.5rem 0;
    z-index: 999;
    border: 1px solid ${props => props.theme.borderColor};
    h1 {
      text-align: inherit;
      margin-bottom: 0;
      span {
        font-size: 1.1rem;
      }
      a {
        color: #0078e7;
        font-size: 25px;
      }
    }
    p.addr {
      margin: 1rem 0;
    }
    p.status {
      margin-bottom: 0.5rem;
    }
    .controls {
      position: absolute;
      bottom: 0;
      right: 0;
      margin-top: 0.5rem;
      text-align: center;
      button {
        margin: 10px;
      }
    }
  }
  #content {
    margin-top: 0.5rem;
    grid-template-columns: 60% auto;
    grid-gap: 0.5rem;
    .desc-content {
      background-color: #fff;
      padding: 1rem 0.5rem;
    }
    .info {
      margin-left: 1rem;
      .info-date {
        margin: 0.8rem 0;
      }
      .address {
        margin-top: 0.8rem;
      }
    }
  }
  #photos {
    margin-top: 2rem;
    .photos .slick-track {
      margin-left: 0;
      img {
        padding: 5px;
      }
    }
  }
  @media (max-width: ${props => props.theme.sm}) {
    #map {
      display: none;
    }
    #mobileMap {
      display: block;
    }
    #title {
      position: relative;
      margin-top: inherit;
      max-width: inherit;
    }
    #content {
      grid-template-columns: auto;
      .info {
        grid-row: 1;
      }
    }
  }
`

function EventPage({ slug }) {
  const [description, setDescription] = useState(null)
  const [diagOpen, setDiagOpen] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [occurrence, setOccurrence] = useState({})
  const [occurrenceStr, setOccurrenceStr] = useState('')
  const [showDays, setShowDays] = useState(false)

  const { loading, event } = useEvent({ slug })

  useEffect(() => {
    if ((!loading && !event) || (event && !allowedEvent(event))) {
      showSnack(`L'évènement à l'adresse "${slug}" est introuvable`, 'error')
      navigate('/')
    }
  }, [event, loading, slug])

  useEffect(() => {
    ;(async () => {
      if (event) setDescription(await markToSafeHTML(event.description))
    })()
  }, [event])

  useEffect(() => {
    if (event) {
      setAdmin(isAdmin(event.group.community))
      setOccurrence(JSON.parse(event.occurrence))
    }
  }, [event])

  useEffect(() => {
    let str = ''
    let count = 0
    days.forEach(({ label, value }) => {
      if (occurrence[value]) {
        if (count === 0) setShowDays(true)
        str += (count > 0 ? ', ' : '') + label
        count += 1
      }
    })
    setOccurrenceStr(str)
  }, [occurrence])

  const archive = () => {
    if (!isAdmin(event.group.community)) {
      return showSnack('Vous ne pouvez pas archiver cet évènement', 'error')
    }
    const next = () => {
      showSnack('Évènement archivé avec succès')
      navigate('/app')
    }
    const fallback = error => {
      showSnack('Une erreur est survenue', 'error')
      console.log(error)
    }
    archiveEvent(event._id, next, fallback)
  }

  return (
    <Wrapper>
      {!loading && <SingleMap coords={event && event.location.coordinates} viewOffset={0.006} zoom={16} />}
      <Page loading={loading && !event}>
        {event && (
          <>
            <Seo title={event.name} />
            <section className='grid' id='title'>
              <h1>
                {event.name}{' '}
                {event.group && (
                  <p>
                    <span>par</span>&nbsp;
                    <Link title='Voir le group' to={`/group/${event.group.slug}`}>
                      {event.group.name}
                    </Link>
                  </p>
                )}
              </h1>
              <p className='addr text-wrap'>{event.location.address}</p>
              <If condition={admin}>
                <p className='status bold'>
                  {event.status === 'archived' && <span className='red'>Archivé</span>}
                  {event.status === 'waiting' && <span className='red'>Hors ligne</span>}
                  {event.status === 'online' && <span className='green'>En ligne</span>}
                  {event.isPrivate && ' | Évènement privé'}
                </p>
                <div className='controls'>
                  <Fab
                    aria-label='Modifier'
                    className='edit'
                    onClick={() => navigate(`/app/event/edit/${event._id}`)}
                    size='small'
                    title='Modifier'
                  >
                    <EditIcon />
                  </Fab>
                  <Fab
                    aria-label='Archiver'
                    className='archive'
                    color='secondary'
                    onClick={() => setDiagOpen(true)}
                    size='small'
                    title='Archiver'
                  >
                    <DeleteIcon />
                  </Fab>
                </div>
                <Dialog
                  action={archive}
                  close={() => setDiagOpen(false)}
                  isOpen={diagOpen}
                  text='Cet évènement ne sera pas supprimé.'
                  title='Voulez-vous vraiment archiver cet évènement ?'
                />
              </If>
            </section>
            <section className='grid' id='content'>
              <div
                className='desc-content'
                dangerouslySetInnerHTML={{ __html: description }} // eslint-disable-line react/no-danger
              />
              <div className='info'>
                <div className='info-date'>
                  <p>
                    <strong>{formatStart(event.startDate)}</strong>
                  </p>
                  <p>{formatPlage(event, true)}</p>
                </div>
                {showDays && (
                  <p>
                    Répétition de l&rsquo;évènement : <br />
                    Tous les <em>{occurrenceStr}</em>
                  </p>
                )}
                <p className='address'>
                  Adresse :<br />
                  {event.location.address}
                </p>
              </div>
            </section>
            <SingleMap coords={event && event.location.coordinates} id='mobileMap' zoom={16} />
            <section id='photos'>
              <p>{`${event.photos && event.photos.length ? `Photos (${event.photos.length}) :` : ''}`}</p>
              <PhotoList className='photos' photos={event.photos} />
            </section>
          </>
        )}
      </Page>
    </Wrapper>
  )
}

EventPage.propTypes = { slug: PropTypes.string }

export default EventPage
