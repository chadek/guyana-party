import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import { showSnack } from '../Snack'
import { goPublic, publish } from '../../lib/services/eventService'

const Wrapper = styled.div`
  grid-template-columns: auto auto;
  justify-content: center;
  grid-gap: 3rem;
  .error {
    color: ${props => props.theme.errorColor};
  }
  @media (max-width: ${props => props.theme.xs}) {
    grid-template-columns: auto;
    grid-gap: 0.5rem;
  }
`

function EventStatus({
  event: { _id: id, author, isPrivate, status },
  className
}) {
  const [isPublicState, setIsPublicState] = useState(!isPrivate)
  const [isOnlineState, setIsOnlineState] = useState(status === 'online')

  const handlePublic = e => {
    e.persist()
    goPublic(
      { id, cancel: isPublicState },
      () => {
        showSnack(`Votre évènement est ${isPublicState ? 'privé' : 'public'}`)
        setIsPublicState(!isPublicState)
      },
      error => {
        console.log(error)
        showSnack('Une erreur interne est survenu', 'error')
      }
    )
  }

  const handleOnline = e => {
    e.persist()
    publish(
      { id, cancel: isOnlineState },
      () => {
        showSnack(
          `Votre évènement est ${isOnlineState ? 'non publié' : 'en ligne !'}`
        )
        setIsOnlineState(!isOnlineState)
      },
      error => {
        console.log(error)
        showSnack('Une erreur interne est survenu', 'error')
      }
    )
  }

  return (
    <Wrapper className={`grid ${className || ''}`}>
      <Grid alignItems='center' component='label' container spacing={1}>
        <Grid item>{!isPublicState ? <strong>Privé</strong> : 'Privé'}</Grid>
        <Grid item>
          <Switch
            checked={isPublicState}
            color='primary'
            onChange={handlePublic}
          />
        </Grid>
        <Grid item>{isPublicState ? <strong>Public</strong> : 'Public'}</Grid>
      </Grid>
      <Grid alignItems='center' component='label' container spacing={1}>
        <Grid item>
          {!isOnlineState ? (
            <strong className='error'>Non publié</strong>
          ) : (
            'Non publié'
          )}
        </Grid>
        <Grid item>
          <Switch
            checked={isOnlineState}
            color='primary'
            onChange={handleOnline}
          />
        </Grid>
        <Grid item>
          {isOnlineState ? <strong>En ligne</strong> : 'En ligne'}
        </Grid>
      </Grid>
    </Wrapper>
  )
}

EventStatus.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    isPrivate: PropTypes.bool,
    status: PropTypes.string.isRequired
  }),
  className: PropTypes.string
}

export default EventStatus
