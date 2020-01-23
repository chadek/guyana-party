import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import WarningIcon from '@material-ui/icons/Warning'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import { snackState, subscribe } from '../lib/state'

const Wrapper = styled.div`
  .success {
    background: #43a047;
  }
  .info {
    background: #1976d2;
  }
  .warning {
    background: #ffa000;
  }
  .error {
    background: #d32f2f;
  }
  .icon {
    font-size: 20px;
  }
  .iconVariant {
    opacity: 0.9;
    margin-right: 8px;
  }
  .message {
    display: flex;
    align-items: center;
  }
`

const variantIcons = {
  success: <CheckCircleIcon className='icon iconVariant' />,
  warning: <WarningIcon className='icon iconVariant' />,
  error: <ErrorIcon className='icon iconVariant' />,
  info: <InfoIcon className='icon iconVariant' />
}

function Snack({ msg, variant }) {
  const hideSnack = () => snackState.setState({ msg: '', variant: '' })

  return (
    <Wrapper>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000}
        onClose={(e, reason) => {
          if (reason === 'clickway') return
          hideSnack()
        }}
        open={!!msg}
      >
        <SnackbarContent
          action={[
            <IconButton aria-label='Close' className='close' color='inherit' key='close' onClick={hideSnack}>
              <CloseIcon className='icon' />
            </IconButton>
          ]}
          aria-describedby='client-snackbar'
          className={variant}
          message={
            <span className='message' id='client-snackbar'>
              {variantIcons[variant]}
              {msg}
            </span>
          }
        />
      </Snackbar>
    </Wrapper>
  )
}

Snack.propTypes = { msg: PropTypes.string, variant: PropTypes.string }

export default subscribe(Snack, [snackState], ({ snackState: { msg, variant } }) => ({ msg, variant }))

export const showSnack = (msg, variant = 'success') => snackState.setState({ msg, variant })
