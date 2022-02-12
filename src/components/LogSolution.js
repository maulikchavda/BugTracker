import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { ipcRenderer } from 'electron'
import FormContainer from './FormContainer'

const LogSolution = ({ history }) => {
  const [solution, setSolution] = useState('')
  const [solutionLink, setSolutionLink] = useState('')

  const logId = history.location.pathname.split('/')[2]
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null
  useEffect(() => {
    let isMounted = true
    ipcRenderer.send('log:load', logId, userInfo)

    ipcRenderer.on('log:get', (e, log) => {
      const parsedlog = JSON.parse(log)
      if (isMounted) {
        setSolution(parsedlog.solution)
        setSolutionLink(parsedlog.solutionLink)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <FormContainer>
      <Link to='/' className='btn btn-dark my-3'>
        Go Back
      </Link>
      <h1>Solution to the Bug</h1>
      <Form>
        <Form.Group controlId='solutionlink'>
          <Form.Label style={{ fontSize: '1.2em' }}>Solution Link</Form.Label>
          <Form.Control
            as='a'
            className='form-control-md'
            style={{
              textDecoration: 'none',
              color: 'blueviolet',
              paddingLeft: '10px',
              fontSize: '1.2em'
            }}
            href={solutionLink}
            target='_blank'
            readOnly
          >
            {solutionLink}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='solution' className='my-3'>
          <Form.Label style={{ fontSize: '1.2em' }}>Solution</Form.Label>
          <Form.Control
            as='textarea'
            rows='6'
            cols='70'
            style={{ fontSize: '1.2em' }}
            value={solution}
            readOnly
          ></Form.Control>
        </Form.Group>
      </Form>
    </FormContainer>
  )
}

export default LogSolution
