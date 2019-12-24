import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import CloseIcon from '@material-ui/icons/Cancel'
import { compress } from '../../lib/utils'

const Wrapper = styled.div`
  .dropgrid {
    grid-template-columns: auto 1fr;
    grid-gap: 1rem;
    margin-top: 1rem;
    aside {
      padding: 2px;
      border: 1px solid ${props => props.theme.borderColor};
    }
    .grid-item {
      position: relative;
      .preview {
        width: 100px;
        height: 100px;
        object-fit: cover;
      }
      .delete {
        position: absolute;
        right: 4px;
        background: #fff;
        cursor: pointer;
      }
    }
  }
  @media screen and (max-width: ${props => props.theme.sm}) {
    .dropgrid {
      grid-template-columns: auto;
    }
  }
`

const StyledDropArea = styled.div`
  width: 320px;
  height: 200px;
  border-radius: 5px;
  border: 3px dashed;
  text-align: center;
  cursor: pointer;
  &.accepted {
    background: #00800030;
  }
  &.rejected {
    background-color: ${props => props.theme.errorBgColor};
    border-color: ${props => props.theme.errorBorderColor};
    .label {
      color: ${props => props.theme.errorColor};
    }
  }
  .label {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
  @media screen and (max-width: ${props => props.theme.xs}) {
    width: 100%;
  }
`

const limitSize = 5 // MB
const maxSize = limitSize * 1048576 // maxSize * 1024 * 1024 (MB)
const maxFiles = 3

function Photos({ photos, setPhotos, disabled }) {
  const [loading, setLoading] = useState(false)
  const [dropError, setDropError] = useState('')
  // const [objectUrls, setObjectUrls] = useState([])

  useEffect(
    () => () => photos.forEach(p => URL.revokeObjectURL(p.preview)), // Revoke the data uris to avoid memory leaks
    [photos]
  )

  const handlePreviewDrop = async (acceptedFiles, rejectedFiles) => {
    setDropError('')
    if (rejectedFiles.length > 0) {
      return setDropError(
        `Veuillez insérer une image valide (png, jpeg, etc.) de taille < ${limitSize}Mo.`
      )
    }
    if (photos.length + acceptedFiles.length > maxFiles) {
      return setDropError(
        `Vous ne pouvez déposer qu${
          maxFiles === 1 ? "'" : 'e '
        }${maxFiles} image${maxFiles > 1 ? 's' : ''}.`
      )
    }
    setLoading(true)

    compress(acceptedFiles, data => {
      // const objUrls = []
      const newPhotos = data.map(({ photo, info }, index) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Added "${photo.name}":`, info)
        }
        // const preview = URL.createObjectURL(photo.data)
        // objUrls.push(preview)
        return Object.assign(photo.data, {
          preview: URL.createObjectURL(photo.data)
          // id: `${Date.now()}${photos.length}${index}`
        })
      })
      // setObjectUrls(objUrls)
      setPhotos([...photos, ...newPhotos])
      setLoading(false)
    })
  }

  const deletePhoto = photo => {
    // setPhotos(photos.filter(p => p.id !== photo.id))
    setPhotos(photos.filter(p => p.preview !== photo.preview))
    // URL.revokeObjectURL(photo.preview)
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: 'image/*',
    disabled: loading,
    maxSize: maxSize,
    onDrop: handlePreviewDrop
  })

  return (
    <Wrapper className='photos'>
      <p className={dropError ? 'error' : ''}>
        {dropError || 'Déposez vos photos dans la zone ci-dessous :'}
      </p>
      <div className='grid dropgrid'>
        <StyledDropArea
          {...getRootProps({
            className: `dropzone ${
              isDragAccept ? 'accepted' : isDragReject ? 'rejected' : ''
            }`
          })}
        >
          <input disabled={disabled} {...getInputProps()} />
          {loading ? (
            <div className='label'>
              <CircularProgress />
            </div>
          ) : (
            <p className='label'>
              {isDragAccept && '➡ Déposez... ⬅'}
              {isDragReject && '⚠️ Photo(s) invalide(s) !'}
              {!isDragActive && '➡ Insérez vos photos ici ⬅'}
            </p>
          )}
        </StyledDropArea>
        <aside>
          {photos && photos.length > 0 && (
            <Grid container spacing={1}>
              {photos.map((p, index) => (
                <Grid className='grid-item' item key={index}>
                  <img alt='Preview' className='preview' src={p.preview} />
                  {!disabled && (
                    <CloseIcon
                      className='delete'
                      onClick={() => deletePhoto(p)}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          )}
        </aside>
      </div>
    </Wrapper>
  )
}

Photos.propTypes = {
  photos: PropTypes.array.isRequired,
  setPhotos: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}
export default Photos
