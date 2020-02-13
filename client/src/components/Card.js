import Fab from '@material-ui/core/Fab'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { formatPlage } from '../lib/date'
import { isAdmin } from '../lib/services/communityService'
import { archiveEvent, removeEvent } from '../lib/services/eventService'
import { archiveGroup, removeGroup } from '../lib/services/groupService'
import { Image, Link } from './addons'
import Dialog from './Dialog'
import { showSnack } from './Snack'

const Wrapper = styled.div`
  position: relative;
  margin: 0.5rem;
  box-shadow: 1px 1px 5px ${props => props.theme.borderColor};
  border: 1px solid rgb(239, 239, 239);
  transition: box-shadow 0.3s ease;
  .caption {
    color: rgba(0, 0, 0, 0.8);
    line-height: 1.5;
    font-size: 20px;
    padding: 0.5rem 0;
    .title {
      padding: 0 0.5rem;
      p {
        font-size: 15px;
      }
    }
  }
  .overlay {
    opacity: 0;
    position: absolute;
    top: 0;
    background-color: rgba(0, 0, 0, 0.2);
    color: #fff;
    height: 200px;
    width: 100%;
    z-index: 10;
    transition: opacity 0.3s ease;
    .edit,
    .delete {
      position: absolute;
      margin: 10px;
      width: 46px;
      height: 46px;
    }
    .delete {
      right: 0;
    }
    .text {
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      padding: 5px;
      a {
        color: #fff;
      }
    }
  }
  .red {
    color: rgb(248, 99, 73);
  }
  .green {
    color: #43a047;
  }
  &:hover {
    box-shadow: 0 15px 15px -15px gray;
    .overlay {
      opacity: 1;
    }
  }
`

function Card({
  data: { name, photos, slug, _id, startDate, endDate, isPrivate, status, group, community },
  isGroup,
  isArchived
}) {
  const [diagOpen, setDiagOpen] = useState(false)
  const [diagRemoveOpen, setDiagRemoveOpen] = useState(false)
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    setAdmin(isAdmin(isGroup ? community : group.community))
  }, [community, group, isGroup])

  // useEffect(
  //   () => () => photo && URL.revokeObjectURL(photo), // Revoke the data uris to avoid memory leaks
  //   [photo]
  // )

  const archive = () => {
    // if (!admin) {
    //   return showSnack(
    //     `Vous ne pouvez pas archiver ce${isGroup ? ' groupe' : 't évènement'}`,
    //     'error'
    //   )
    // }
    const next = () => {
      showSnack(`${isGroup ? 'Groupe' : 'Évènement'} archivé avec succès`)
      if (typeof window !== 'undefined') window.location.reload()
    }
    const fallback = error => {
      showSnack('Une erreur est survenue', 'error')
      console.log(error)
    }
    if (isGroup) return archiveGroup(_id, next, fallback)
    archiveEvent(_id, next, fallback)
  }

  const remove = () => {
    const next = () => {
      showSnack(`${isGroup ? 'Groupe' : 'Évènement'} supprimé avec succès`)
      if (typeof window !== 'undefined') window.location.reload()
    }
    const fallback = error => {
      showSnack('Une erreur est survenue', 'error')
      console.log(error)
    }
    if (isGroup) return removeGroup(_id, next, fallback)
    removeEvent(_id, next, fallback)
  }

  return (
    <Wrapper>
      <Image alt={name} className='cover' height='200' loading='lazy' src={photos.length > 0 ? photos[0] : ''} />
      <div className='caption'>
        <div className='title text-wrap center'>
          <Link aria-label={name} title={name} to={`/${isGroup ? 'group' : 'event'}/${slug}`}>
            <strong className={status === 'waiting' ? 'red' : ''}>{name}</strong>
          </Link>
          {!isGroup && <p>{formatPlage({ startDate, endDate })}</p>}
        </div>
      </div>
      <div className='overlay'>
        {admin && (
          <>
            <Link to={`/app/${isGroup ? 'group' : 'event'}/edit/${_id}`}>
              <Fab aria-label='Modifier' className='edit' title='Modifier'>
                <EditIcon />
              </Fab>
            </Link>
            {(!isArchived && (
              <Fab
                aria-label='Archiver'
                className='delete'
                color='secondary'
                onClick={() => setDiagOpen(true)}
                title='Archiver'
              >
                <DeleteIcon />
              </Fab>
            )) || (
              <Fab
                aria-label='Supprimer'
                className='delete'
                color='secondary'
                onClick={() => setDiagRemoveOpen(true)}
                title='Supprimer'
              >
                <DeleteIcon />
              </Fab>
            )}
          </>
        )}
        <div className='text'>
          {!isGroup && (
            <>
              <Link title='Voir le groupe' to={`/group/${group.slug}`}>
                <p className='text-wrap'>Organisateur : {group.name}</p>
              </Link>
              {admin && (
                <p>
                  {status === 'waiting' && <span className='red'>Hors ligne</span>}
                  {status === 'online' && <span className='green'>En ligne</span>}
                  {isPrivate && ' | Évènement privé'}
                </p>
              )}
            </>
          )}
          <p>{isGroup && ((admin && 'Vous êtes administrateur') || 'Vous êtes membre')}</p>
        </div>
      </div>
      <Dialog
        action={archive}
        close={() => setDiagOpen(false)}
        isOpen={diagOpen}
        text={`Ce${isGroup ? ' groupe' : 't évènement'} ne sera pas supprimé.`}
        title={`Voulez-vous vraiment archiver "${name}" ?`}
      />
      <Dialog
        action={remove}
        close={() => setDiagRemoveOpen(false)}
        isOpen={diagRemoveOpen}
        text={`Ce${isGroup ? ' groupe' : 't évènement'} sera définitivement supprimé !`}
        title={`Voulez-vous vraiment supprimer "${name}" ?`}
      />
    </Wrapper>
  )
}

Card.propTypes = {
  data: PropTypes.object.isRequired,
  isGroup: PropTypes.bool,
  isArchived: PropTypes.bool
}

export default Card
