import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import showAlert from '../../utils/showAlert'

const AddLogItem = ({ addItem }) => {
  const [text, setText] = useState('')
  const [platform, setPlatform] = useState('')
  const [priority, setPriority] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [imagePath, setImagePath] = useState('')
  const [file, setFile] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    variant: 'danger'
  })

  useEffect(() => {
    let isMounted = true
    if (uploading) {
      const formData = new FormData()
      formData.append('image', file)
      const value = Object.fromEntries(formData.entries())
      ipcRenderer.send('image:upload', value.image.path)
    }
    ipcRenderer.on('upload:getimages', (e, data) => {
      if (isMounted) {
        setImagePath(JSON.parse(data))
        setUploading(false)
        if (!uploading && imagePath !== '') {
          addItem({
            text,
            platform,
            priority,
            description,
            image: imagePath
          })
          notifyUser({
            title: 'New Bug Added',
            body: `Checkout the latest bug`
          })
          setText('')
          setPriority('')
          setPlatform('')
          setDescription('')
          setImagePath('')
          setImage('')
        }
      }
    })

    ipcRenderer.on('error:info', (e, error) => {
      if (isMounted) {
        const parsedError = JSON.parse(error)
        setError(
          parsedError.response && parsedError.response.data.message
            ? parsedError.response.data.message
            : parsedError.message
        )
      }
    })

    if (error) {
      setUploading(false)
      showAlert(setAlert, 'Please choose an image only!')
    }

    return () => {
      isMounted = false
    }
  }, [uploading, imagePath, error])

  const onSubmit = e => {
    e.preventDefault()
    if (
      text === '' ||
      description === '' ||
      platform === '' ||
      priority === '' ||
      image === ''
    ) {
      showAlert(setAlert, 'Please enter all required fields')
    }
    if (
      text !== '' &&
      description !== '' &&
      platform !== '' &&
      priority !== '' &&
      image !== ''
    ) {
      setUploading(true)
    }
  }

  function notifyUser (options) {
    new Notification(options.title, options)
  }

  const uploadFileHandler = e => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setImage(selectedFile.path)
  }

  return (
    <Card className='mt-5 mb-3' style={{ border: '1px solid grey' }}>
      <Card.Body>
        {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
        <Form onSubmit={onSubmit}>
          <Row className='my-3'>
            <Col>
              <Form.Control
                placeholder='Bug Title'
                value={text}
                onChange={e => setText(e.target.value)}
              />
            </Col>
          </Row>
          <Row className='my-3'>
            <Col>
              <Form.Control
                placeholder='Bug Description'
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </Col>
          </Row>
          <Row className='my-3'>
            <Col>
              <Form.Group controlId='image'>
                <Form.Control
                  type='text'
                  placeholder='Image Location'
                  value={image}
                  onChange={e => setImage(e.target.value)}
                ></Form.Control>
                <Form.File
                  id='image-file'
                  label='Choose File'
                  custom
                  onChange={uploadFileHandler}
                ></Form.File>
                {uploading && <h6>Loading...</h6>}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Control
                as='select'
                value={platform}
                onChange={e => setPlatform(e.target.value)}
              >
                <option value='0'>Select platform</option>
                <option value='mac'>Mac</option>
                <option value='windows'>Windows</option>
                <option value='linux'>Linux</option>
              </Form.Control>
            </Col>
            <Col>
              <Form.Control
                as='select'
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value='0'>Select Priority</option>
                <option value='low'>Low</option>
                <option value='moderate'>Moderate</option>
                <option value='high'>High</option>
              </Form.Control>
            </Col>
          </Row>
          <Row className='my-3'>
            <Col>
              <Button
                type='submit'
                variant='secondary'
                className='btn btn-dark'
                block
              >
                Add Log
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default AddLogItem
