import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'

const Wrapper = styled.div`
  .label {
    margin-bottom: 0.5rem;
  }
  .editor-toolbar.fullscreen {
    top: 44px;
  }
  .editor-preview-active-side {
    top: 43px;
    z-index: 1010;
  }
  .CodeMirror-fullscreen {
    top: 94px;
    z-index: 1010;
  }
`

export default function Description({ label, placeholder, value, setValue, readOnly, error }) {
  const [instance, setInstance] = useState()

  useEffect(() => {
    if (instance) instance.codemirror.setOption('readOnly', readOnly)
  }, [instance, readOnly])

  return (
    <Wrapper className='description'>
      {label && <p className={`label${error ? ' error' : ''}`}>{label}</p>}
      <SimpleMDE getMdeInstance={setInstance} onChange={setValue} options={{ placeholder }} value={value} />
    </Wrapper>
  )
}

Description.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  error: PropTypes.bool
}
