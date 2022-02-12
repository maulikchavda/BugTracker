import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { ipcRenderer } from 'electron'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'
import LogItem from './LogItem'
import AddLogItem from './AddLogItem'
import showAlert from '../../utils/showAlert'

const LogsScreen = () => {
  const [logs, setLogs] = useState([])
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    variant: 'success'
  })
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null
  useEffect(() => {
    let isMounted = true
    ipcRenderer.send('logs:load')

    ipcRenderer.on('logs:get', (e, logs) => {
      const sortedLogs = JSON.parse(logs).sort(
        (a, b) =>
          new Date(b.created.substring(0, 19)) -
          new Date(a.created.substring(0, 19))
      )
      if (isMounted) {
        setLogs(sortedLogs)
      }
    })

    ipcRenderer.on('logs:clear', e => {
      if (isMounted) {
        setLogs([])
        showAlert(setAlert, 'Logs cleared')
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  function addItem (item) {
    if (
      item.text === '' ||
      item.platform === '' ||
      item.priority === '' ||
      item.description === ''
    ) {
      showAlert(setAlert, 'Please enter all fields')
      return false
    }
    ipcRenderer.send('logs:add', item, userInfo)
    showAlert(setAlert, 'Log Added', 'success')
  }

  function deleteItem (_id) {
    ipcRenderer.send('logs:delete', _id, userInfo)
    showAlert(setAlert, 'Log Removed')
  }

  function sortByPriority () {
    var sortedLogs = []
    var sortedHigh = logs.filter(log => log.priority === 'high')
    var sortedModerate = logs.filter(log => log.priority === 'moderate')
    var sortedLow = logs.filter(log => log.priority === 'low')
    sortedLogs = sortedLogs.concat(sortedHigh, sortedModerate, sortedLow)
    setLogs(sortedLogs)
  }

  // function sortByDateAndTime(){
  // 	var sortedLogs = logs.sort((a, b) => new Date(b.created.substring(0,19)) - new Date(a.created.substring(0,19)));
  // 	setLogs(sortedLogs);
  // }

  // function clearAllLogs(){
  // 	ipcRenderer.send('clear:logs',userInfo)
  // }

  return (
    <Container>
      <LinkContainer to={`/`}>
        <Button
          variant='dark'
          className='btn-md my-3'
          onClick={userInfo ? () => localStorage.removeItem('userInfo') : null}
        >
          {userInfo && 'Logout'}
        </Button>
      </LinkContainer>
      {/* <Button variant='dark' onClick={clearAllLogs}>
				Clear Logs
			</Button> */}
      <LinkContainer to={`/mylogs`}>
        <Button variant='dark' className='btn-md my-3 float-right'>
          {userInfo && 'My Logs'}
        </Button>
      </LinkContainer>
      <AddLogItem addItem={addItem} />
      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
      {logs.length > 0 && (
        <Dropdown>
          <Dropdown.Toggle
            variant='success'
            id='dropdown-basic'
            drop='none'
            className='my-3'
          >
            <i className='fa fa-sort'></i> Sort By
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              as='span'
              style={{ color: 'black' }}
              onClick={sortByPriority}
            >
              Priority
            </Dropdown.Item>
            {/* <Dropdown.Item as="span" style={{color:'black'}} onClick={sortByDateAndTime}>Date</Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>
      )}

      {logs.length === 0 ? (
        <h1 style={{ textAlign: 'center', marginTop: '40px' }}>
          No Logs Posted
        </h1>
      ) : (
        <Table className='table table-bordered table-hover'>
          <thead className='thead-dark'>
            <tr>
              <th>Priority</th>
              <th>Log Title</th>
              <th>Platform</th>
              <th>Logger</th>
              <th>TimeStamp</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <LogItem key={log._id} log={log} deleteItem={deleteItem} />
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  )
}

export default LogsScreen
