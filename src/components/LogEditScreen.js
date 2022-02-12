import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Card } from 'react-bootstrap'
import validator from 'validator'
import Alert from 'react-bootstrap/Alert'
import { ipcRenderer } from 'electron'
import FormContainer from './FormContainer'
import showAlert from '../../utils/showAlert'

const LogEditScreen = ({ history }) => {
  const [priority, setPriority] = useState('')
  const [text, setText] = useState('')
  const [description, setDescription] = useState('')
  const [platform, setPlatform] = useState('')
  const [created, setCreated] = useState('')
  const [solution, setSolution] = useState('')
  const [solutionLink, setSolutionLink] = useState('')
  const [logger, setLogger] = useState('')
  const [imagePath, setImagePath] = useState('')
  // const [image,setImage] = useState('');
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    variant: 'success'
  })

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
        setPriority(parsedlog.priority)
        setText(parsedlog.text)
        setPlatform(parsedlog.platform)
        setCreated(parsedlog.created)
        setSolution(parsedlog.solution)
        setSolutionLink(parsedlog.solutionLink)
        setLogger(parsedlog.user.name)
        setDescription(parsedlog.description)
        setImagePath(parsedlog.image)
      }
    })

    return () => {
      isMounted = false
    }
  }, [imagePath])

  const submitHandler = e => {
    e.preventDefault()
    //Update Log
    if (solution !== '' && solutionLink !== '') {
      ipcRenderer.send('log:update', logId, solution, solutionLink, userInfo)
    }
    history.push('/')
  }

  return (
    <FormContainer>
      <Link to='/logs' className='btn btn-dark my-3'>
        Go Back
      </Link>
      <h1>Edit Solution</h1>
      <Form
        onSubmit={
          validator.isURL(solutionLink) || solutionLink === ''
            ? submitHandler
            : () => {
                showAlert(setAlert, 'Enter valid URL as a solution', 'danger')
              }
        }
      >
        <Card className='my-2 p-2'>
          <Card.Img
            src={`http://localhost:5000${imagePath.replace(/\\/g, '/')}`}
            alt={text}
            style={{ height: '500px' }}
          />
        </Card>
        <Form.Group controlId='priority'>
          <Form.Label>Priority</Form.Label>
          <Form.Control
            type='text'
            placeholder='Priority'
            value={priority.charAt(0).toUpperCase() + priority.slice(1)}
            onChange={e => setPriority(e.target.value)}
            readOnly
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='logtitle'>
          <Form.Label>Log Title</Form.Label>
          <Form.Control
            type='text'
            placeholder='Log Title'
            value={text.charAt(0).toUpperCase() + text.slice(1)}
            onChange={e => setText(e.target.value)}
            readOnly
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='description'>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type='text'
            placeholder='description'
            value={description}
            onChange={e => setDescription(e.target.value)}
            readOnly
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='platform'>
          <Form.Label>Platform</Form.Label>
          <Form.Control
            type='text'
            placeholder='platform'
            value={platform.charAt(0).toUpperCase() + platform.slice(1)}
            onChange={e => setPlatform(e.target.value)}
            readOnly
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='logger'>
          <Form.Label>Logger</Form.Label>
          <Form.Control
            type='text'
            placeholder='logger'
            value={logger.charAt(0).toUpperCase() + logger.slice(1)}
            onChange={e => setLogger(e.target.value)}
            readOnly
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='created'>
          <Form.Label>Created At</Form.Label>
          <Form.Control
            type='text'
            placeholder='created at'
            value={created.substring(0, 10)}
            onChange={e => setCreated(e.target.value)}
            readOnly
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='solutionlink'>
          <Form.Label>Solution Link</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Solution URL'
            value={solutionLink}
            onChange={e => setSolutionLink(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='solution' className='my-3'>
          <Form.Label>Solution</Form.Label>
          <Form.Control
            as='textarea'
            rows='6'
            cols='70'
            value={solution}
            onChange={e => setSolution(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
        <Button type='submit' variant='primary'>
          Update
        </Button>
      </Form>
    </FormContainer>
  )
}

export default LogEditScreen
