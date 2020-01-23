import React, { useEffect, useState } from 'react'
import { navigate } from 'gatsby'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { isAdmin } from '../../lib/services/communityService'
import { archiveGroup, createGroup, updateGroup, useGroup } from '../../lib/services/groupService'
import If from '../addons/If'
import Dialog from '../Dialog'
import { showSnack } from '../Snack'
import Description from './Mde'
import Page from './Page'
import Photos from './Photos'
import GoBack from './GoBack'

const Wrapper = styled.div`
  #name {
    max-width: 290px;
    margin: auto;
  }
  .mde,
  .photos,
  .save {
    margin-top: 2.5rem;
  }
  .error p,
  p.error {
    color: ${props => props.theme.errorColor};
    font-weight: 600;
  }
  .archive-btn {
    position: fixed;
    bottom: 0;
    right: 0;
    margin: 1rem;
  }
  @media (max-width: ${props => props.theme.xs}) {
    .archive-btn {
      width: 40px;
      height: 40px;
    }
  }
`

function EditGroup({ id }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [nameError, setNameError] = useState('')
  const [descError, setDescError] = useState('')
  const [diagOpen, setDiagOpen] = useState(false)

  const { loading: groupLoading, error, group } = useGroup({ id })

  useEffect(() => {
    if (group && !isAdmin(group.community)) {
      showSnack("Vous n'avez pas accès à cet évènement", 'error')
      return navigate('/app')
    }
  }, [group, id])

  useEffect(() => {
    if (error) {
      showSnack('Une erreur interne est survenue', 'error')
      return navigate('/app')
    }
    if (id && group) {
      setName(group.name)
      setDescription(group.description)
      setPhotos(group.photos)
    } else {
      setName('')
      setDescription('')
      setPhotos([])
    }
  }, [error, group, id])

  const save = () => {
    setNameError('')
    setDescError('')
    if (!name) return setNameError('Veuillez saisir un nom')
    if (!description) return setDescError('Veuillez saisir une description :')
    setLoading(true)

    const next = ({ slug }) => navigate(`/group/${slug || group.slug}`)
    const fallback = error => {
      console.log(error)
      showSnack(`${id ? "L'édition" : 'La création'} du groupe a échoué !`, 'error')
      setLoading(false)
    }

    if (!id) {
      createGroup({ name, description, photos }, next, fallback)
    } else {
      updateGroup({ id, name, description, photos }, next, fallback)
    }
  }

  const archive = () => {
    if (!isAdmin(group.community)) {
      return showSnack('Vous ne pouvez pas archiver ce groupe', 'error')
    }
    const next = () => {
      showSnack('Groupe archivé avec succès')
      navigate('/app')
    }
    const fallback = error => {
      showSnack('Une erreur est survenue', 'error')
      console.log(error)
    }
    archiveGroup(id, next, fallback)
  }

  return (
    <Wrapper>
      <GoBack />
      <Page title={`${id ? 'Edition' : 'Création'} ${name ? `de ${name}` : "d'un groupe"}`}>
        <div id='name'>
          <Grid alignItems='flex-end' container spacing={1}>
            <Grid item>{loading || groupLoading ? <CircularProgress /> : <EditIcon />}</Grid>
            <Grid item>
              <TextField
                disabled={loading || groupLoading}
                error={!!nameError}
                fullWidth
                helperText={nameError}
                label='Nom de votre groupe'
                onChange={e => setName(e.target.value)}
                value={name}
              />
            </Grid>
          </Grid>
        </div>
        <Description
          error={!!descError}
          label={descError || 'Description du groupe et de vos actions :'}
          placeholder='Donnez envie !'
          readOnly={loading || groupLoading}
          setValue={setDescription}
          value={description}
        />
        <Photos disabled={loading || groupLoading} photos={photos} setPhotos={setPhotos} />
        <If condition={!!id}>
          <Fab
            aria-label='Archiver'
            className='archive-btn'
            color='secondary'
            onClick={() => setDiagOpen(true)}
            title='Archiver'
          >
            <DeleteIcon />
          </Fab>
          <Dialog
            action={() => archive()}
            close={() => setDiagOpen(false)}
            isOpen={diagOpen}
            text='Ce groupe ne sera pas supprimé.'
            title={`Voulez-vous vraiment archiver "${name}" ?`}
          />
        </If>
        <div className='save center'>
          <Button
            aria-label='Enregistrer'
            color='primary'
            disabled={loading || groupLoading}
            onClick={save}
            variant='contained'
          >
            {loading || groupLoading ? 'Chargement...' : 'Enregistrer'}
          </Button>
        </div>
      </Page>
    </Wrapper>
  )
}

EditGroup.propTypes = { id: PropTypes.string }

export default EditGroup
