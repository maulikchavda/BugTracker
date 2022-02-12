import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Button from 'react-bootstrap/Button'
import Moment from 'react-moment'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import Dialog from '@material-ui/core/Dialog'
import MaterialButton from '@material-ui/core/Button'
const LogItem = ({
  log: { _id, priority, platform, text, created, user },
  deleteItem
}) => {
  const [open, setOpen] = React.useState(false)
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleCloseCancel = () => {
    setOpen(false)
  }

  const handleCloseOK = _id => {
    setOpen(false)
    deleteItem(_id)
  }

  return (
    <>
      <tr
        className={
          priority === 'high'
            ? 'table-danger text-dark'
            : priority === 'moderate'
            ? 'table-warning text-dark'
            : 'table-success text-dark'
        }
      >
        <td style={{ fontSize: '1.1em' }}>
          <span
            className={
              priority === 'high'
                ? 'badge bg-danger p-2 text-white'
                : priority === 'moderate'
                ? 'badge bg-warning p-2 text-white'
                : 'badge bg-success p-2 text-white'
            }
          >
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        </td>
        <td style={{ fontSize: '1.1em' }}>
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </td>
        <td style={{ fontSize: '1.1em' }}>
          {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </td>
        <td style={{ fontSize: '1.1em' }}>
          {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
        </td>
        <td style={{ fontSize: '1.1em' }}>
          <Moment format='MMMM Do YYYY, h:mm:ss a'>{new Date(created)}</Moment>
        </td>
        <td>
          <LinkContainer to={`/logs/${_id}/edit`}>
            <Button
              variant='light'
              className='btn-sm'
              disabled={user._id === userInfo._id}
            >
              <i className='fas fa-edit'></i>
            </Button>
          </LinkContainer>
          <LinkContainer to={`/logs/${_id}/solution`}>
            <Button variant='light' className='btn-sm'>
              <i className='fas fa-eye'></i>
            </Button>
          </LinkContainer>
          <Button
            variant='danger'
            className='btn-sm'
            onClick={() => handleClickOpen()}
            disabled={user._id !== userInfo._id}
          >
            <i className='fas fa-trash'></i>
          </Button>
        </td>
      </tr>
      <Dialog open={open} onClose={handleCloseCancel}>
        <DialogTitle>{text}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this log?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MaterialButton onClick={handleCloseCancel} color='primary'>
            No
          </MaterialButton>
          <MaterialButton
            onClick={() => handleCloseOK(_id)}
            color='primary'
            autoFocus
          >
            Yes
          </MaterialButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default LogItem
