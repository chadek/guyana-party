import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

const MyDialog = ({ action, close, isOpen, text, title }) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Dialog aria-labelledby="responsive-dialog-title" fullScreen={fullScreen} onClose={close} open={isOpen}>
      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} variant="contained">
          Annuler
        </Button>
        <Button
          onClick={() => {
            close()
            action()
          }}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

MyDialog.propTypes = {
  action: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default React.memo(MyDialog)
