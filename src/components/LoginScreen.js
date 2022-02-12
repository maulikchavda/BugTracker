import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import validator from 'validator'
import Alert from 'react-bootstrap/Alert'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from './FormContainer'
import { ipcRenderer } from 'electron'
import showAlert from '../../utils/showAlert'

const LoginScreen = ({ history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const userInfoFromStorage = localStorage.getItem('userInfo')
    ? localStorage.getItem('userInfo')
    : null
  const [userInfo, setUserInfo] = useState(userInfoFromStorage)
  const [error, setError] = useState(null)
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    variant: 'danger'
  })

  useEffect(() => {
    let isMounted = true
    ipcRenderer.on('userlogin:info', (e, data) => {
      if (isMounted) {
        setUserInfo(data)
        localStorage.setItem('userInfo', JSON.stringify(data))
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
    if (userInfo) {
      history.push('/logs')
    }
    if (error) {
      showAlert(setAlert, 'Invalid email or password')
      setError(null)
    }
    return () => {
      isMounted = false
    }
  }, [history, userInfo, error])

  const submitHandler = e => {
    e.preventDefault()
    //Login
    if (email === '' || password === '') {
      showAlert(setAlert, 'Fill all the required fields')
    } else if (!validator.isEmail(email)) {
      showAlert(setAlert, 'Enter valid email')
    } else {
      ipcRenderer.send('user:login', email, password)
    }
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label style={{ fontWeight: 'bold' }}>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='shadow'
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label style={{ fontWeight: 'bold' }}>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='shadow'
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='my-3'>
          Sign In
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          New Customer?
          <Link to={'/register'}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
