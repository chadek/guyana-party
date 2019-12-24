import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Fab from '@material-ui/core/Fab'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import Button from '@material-ui/core/Button'
import { showSnack } from './Snack'
import { If, Page } from './addons'
import Dialog from './Dialog'
import CardList from './CardList'
import PhotoList from './PhotoList'
import Community from './Community'
import { useEventsByGroup } from '../lib/services/eventService'
import { useGroup, archiveGroup } from '../lib/services/groupService'
import {
  isAdmin,
  confirmMember,
  addPendingRequest,
  removePendingRequest
} from '../lib/services/communityService'
import { markToSafeHTML } from '../lib/utils'

const Wrapper = styled.div`
  h1,
  h2 {
    text-transform: uppercase;
  }
  h2 {
    font-size: 18px;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(151, 151, 151, 0.2);
  }
  #title {
    margin: 2rem 0;
    h1 {
      margin-bottom: 0.5rem;
    }
    .controls {
      margin-bottom: 1rem;
      button {
        margin: 10px;
      }
    }
    .ok {
      color: green;
    }
    .error {
      color: ${props => props.theme.errorColor};
    }
  }
  #desc {
    max-width: 800px;
    margin: 0 auto 3rem;
    .desc-content {
      padding: 1rem 0.5rem;
      margin-bottom: 2rem;
      background: #fff;
    }
  }
  #photos {
    .photos {
      .slick-track {
        margin-left: 0;
      }
    }
  }
  #photos,
  .events {
    margin: 0 auto 6rem;
  }
  @media (max-width: ${props => props.theme.xs}) {
    #desc {
      margin-bottom: 2rem;
      .photos .slick-track {
        margin-left: auto;
      }
    }
    #photos,
    .events {
      margin: 0 auto 3rem;
    }
  }
`

function GroupPage({ slug }) {
  const [description, setDescription] = useState(null)
  const [diagOpen, setDiagOpen] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [inCommunity, setInCommunity] = useState(false)
  const [pending, setPending] = useState(false)
  const [denied, setDenied] = useState(false)

  const { loading, group } = useGroup({ slug })
  const { loading: eventLoading, events } = useEventsByGroup(group)

  useEffect(() => {
    if ((!loading && !group) || (group && group.status !== 'online')) {
      showSnack(`Le group à l'adresse "${slug}" est introuvable`, 'error')
      navigate('/')
    }
  }, [group, loading, slug])

  useEffect(() => {
    if (group) {
      setAdmin(isAdmin(group.community))
      setInCommunity(confirmMember(group.community))
      setPending(confirmMember(group.community, 'pending_request'))
      setDenied(confirmMember(group.community, 'denied'))
    }
  }, [group])

  useEffect(() => {
    ;(async () => {
      if (group) setDescription(await markToSafeHTML(group.description))
    })()
  }, [group])

  const archive = (id, author) => {
    const next = () => {
      showSnack('Groupe archivé avec succès')
      navigate('/app')
    }
    const fallback = error => {
      showSnack('Une erreur est survenue', 'error')
      console.log(error)
    }
    archiveGroup(group._id, next, fallback)
  }

  return (
    <Page loading={loading && !group}>
      <Wrapper>
        {group && (
          <>
            <section className='grid' id='title'>
              <h1>{group.name}</h1>
              <If condition={admin}>
                <div className='controls center'>
                  <Fab
                    aria-label='Modifier'
                    className='edit'
                    onClick={() => navigate(`/app/group/edit/${group._id}`)}
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
                  text='Ce groupe ne sera pas supprimé.'
                  title='Voulez-vous vraiment archiver ce groupe ?'
                />
              </If>
              <center>
                {!inCommunity && (
                  <Button
                    aria-label='Adhérer au groupe'
                    onClick={() => addPendingRequest(group)}
                    size='small'
                    title='Adhérer au groupe'
                    variant='contained'
                  >
                    Adhérer
                  </Button>
                )}
                {pending && (
                  <>
                    <p className='ok'>
                      Votre demande d&rsquo;adhésion est en cours de traitement.
                    </p>
                    <Button
                      onClick={() => removePendingRequest(group)}
                      size='small'
                      variant='contained'
                    >
                      Annuler la demande
                    </Button>
                  </>
                )}
                {denied && (
                  <strong className='error'>Vous avez été bloqué.</strong>
                )}
              </center>
            </section>

            <section id='desc'>
              {/* <p>Description :</p> */}
              <div
                className='desc-content'
                dangerouslySetInnerHTML={{ __html: description }} // eslint-disable-line react/no-danger
              />
            </section>
            <section id='photos'>
              <p>
                {`${
                  group.photos && group.photos.length
                    ? `Photos (${group.photos.length}) :`
                    : ''
                }`}
              </p>
              <PhotoList className='photos' photos={group.photos} />
            </section>
            <CardList
              addBtn={admin}
              className='events'
              data={events}
              groupId={group._id}
              loading={eventLoading}
              title='Évènements en cours'
            />
            <Community group={group} />
          </>
        )}
      </Wrapper>
    </Page>
  )
}

GroupPage.propTypes = { slug: PropTypes.string }

export default GroupPage
