import React, { useEffect } from 'react'
import { ipcRenderer } from 'electron'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'
import LogItem from './LogItem'
import showAlert from '../../utils/showAlert'

const MyLogsScreen = ({ deleteItem }) => {
  const [logs, setLogs] = React.useState([])
  const [alert, setAlert] = React.useState({
    show: false,
    message: '',
    variant: 'success'
  })

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null
  useEffect(() => {
    let isMounted = true
    ipcRenderer.send('logs:mylogs', userInfo)

    ipcRenderer.on('logs:getMy', (e, logs) => {
      if (isMounted) {
        const sortedLogs = JSON.parse(logs).sort(
          (a, b) =>
            new Date(b.created.substring(0, 19)) -
            new Date(a.created.substring(0, 19))
        )
        setLogs(sortedLogs)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  function deleteItem (_id) {
    ipcRenderer.send('logs:delete', _id, userInfo)
    showAlert(setAlert, 'Log Removed')
  }

  return (
    <Container>
      <Link to='/logs' className='btn btn-dark my-3'>
        Go Back
      </Link>
      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
      {logs.length > 0 ? (
        <Table className='table table-hover'>
          <thead className='thead-dark'>
            <tr>
              <th>Priority</th>
              <th>Title</th>
              <th>Platform</th>
              <th>User</th>
              <th>Reported At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <LogItem key={log._id} log={log} deleteItem={deleteItem} />
            ))}
          </tbody>
        </Table>
      ) : (
        <h1>You haven't posted any logs yet</h1>
      )}
    </Container>
  )
}

export default MyLogsScreen
