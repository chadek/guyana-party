import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import isEmail from 'validator/lib/isEmail'
import CardList from '../CardList'
import { Image, Page } from '../addons'
import { FormWrapper } from '../Login/LoginStyles'
import { useAuth } from '../../lib/services/authService'
import { useArchived as useArchivedEvents } from '../../lib/services/eventService'
import { useArchived as useArchivedGroups } from '../../lib/services/groupService'
import { compress, reload } from '../../lib/utils'
import FormInput from '../addons/FormInput'
import { showSnack } from '../Snack'

const Wrapper = styled.section`
  max-width: 430px;
  margin: 0 auto 3rem;
  img {
    justify-self: center;
    height: 192px;
    max-width: 192px;
    cursor: pointer;
    &:hover {
      border: 2px solid #000;
    }
  }
  .input-section,
  .save {
    margin-top: 1rem;
  }
`

const previews = []

function Profile() {
  const [photo, setPhoto] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)

  const { loading: userLoading, user, updateUser } = useAuth()
  const { loading: eventLoading, events } = useArchivedEvents()
  const { loading: groupLoading, groups } = useArchivedGroups()

  useEffect(() => () => previews.forEach(p => URL.revokeObjectURL(p)), []) // Revoke the data uris to avoid memory leaks

  useEffect(() => {
    if (user) {
      setPhoto(user.photo)
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const fileHandle = e => {
    e.persist()
    const { files } = e.target
    if (files.length > 0) {
      compress([...files], data => {
        const { photo: p, info } = data[0]
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Added "${p.name}":`, info)
        }
        const preview = URL.createObjectURL(p.data)
        previews.push(preview)
        setPhoto(Object.assign(p.data, { preview }))
      })
    }
  }

  const checkName = value => {
    setNameError('')
    if (!value) return setNameError('Veuillez entrer votre nom')
    if (value.length < 5) {
      return setNameError('Le nom doit comporter au moins 5 caractères')
    }
    return true
  }

  const checkEmail = value => {
    setEmailError('')
    if (!value) return setEmailError('Veuillez entrer votre adresse email')
    if (!isEmail(value)) return setEmailError("L'email est invalide")
    return true
  }

  const save = async e => {
    e.preventDefault()
    setNameError('')
    setEmailError('')
    if (!checkName(name) || !checkEmail(email)) return
    setLoading(true)
    await updateUser(
      { photo, name, email: !user.provider ? email : null },
      () => {
        showSnack('Modification éffectuée avec succès !')
        reload()
      },
      error => {
        showSnack('La modification a echoué !', 'error')
        console.log(error)
      }
    )
    setLoading(false)
  }

  return (
    <Page loading={userLoading && !user}>
      <Wrapper className='grid'>
        <Image
          alt='User avatar'
          className='cover'
          onClick={() => {
            document.getElementById('file').click()
          }}
          src={photo.preview || photo}
          title='Cliquez pour modifier votre photo'
        />
        <FormWrapper onSubmit={save}>
          <FormInput accept='image/*' disabled={loading} hidden id='file' onChange={fileHandle} type='file' />
          <FormInput
            disabled={loading}
            error={nameError}
            id='name'
            label='Nom'
            onBlur={e => checkName(e.target.value)}
            onChange={e => setName(e.target.value)}
            placeholder='Votre nom'
            value={name}
          />
          <FormInput
            disabled={loading || !!(user && user.provider)}
            error={emailError}
            id='email'
            label='Email'
            onBlur={e => checkEmail(e.target.value)}
            onChange={e => setEmail(e.target.value)}
            placeholder='exemple@email.com'
            title={
              user && user.provider
                ? `Vous êtes connecté via ${user.provider}, vous ne pouvez éditer votre email ici.`
                : ''
            }
            value={email}
          />
          <div className='save center'>
            <Button
              aria-label='Enregistrer'
              color='primary'
              disabled={loading || userLoading}
              onClick={save}
              variant='contained'
            >
              {loading ? 'Chargement...' : 'Enregistrer'}
            </Button>
          </div>
        </FormWrapper>
      </Wrapper>
      <CardList data={events} isArchived loading={eventLoading} title='Mes évènements archivés' />
      <CardList data={groups} isArchived isGroup loading={groupLoading} title='Mes groupes archivés' />
    </Page>
  )
}

export default Profile
