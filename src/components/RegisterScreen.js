import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ipcRenderer } from 'electron'
import validator from 'validator'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'
import FormContainer from './FormContainer'
import showAlert from '../../utils/showAlert'

const RegisterScreen = ({ history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

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
    if (isMounted) {
      ipcRenderer.on('userregister:info', (e, data) => {
        setUserInfo(data)
        localStorage.setItem('userInfo', JSON.stringify(data))
      })
      ipcRenderer.on('error:info', (e, error) => {
        const parsedError = JSON.parse(error)
        setError(
          parsedError.response && parsedError.response.data.message
            ? parsedError.response.data.message
            : parsedError.message
        )
        showAlert(setAlert, 'Invalid email or password')
      })
      if (userInfo) {
        history.push('/logs')
      }
      if (error) {
        showAlert(error)
      }
    }
    return () => {
      isMounted = false
    }
  }, [history, userInfo, error])

  const submitHandler = e => {
    e.preventDefault()
    //Register
    if (
      name === '' ||
      email === '' ||
      password === '' ||
      confirmPassword === ''
    ) {
      showAlert(setAlert, 'Fill all the required fields')
    } else if (!validator.isEmail(email)) {
      showAlert(setAlert, 'Enter valid email')
    } else if (!isGmail(email)) {
      showAlert(setAlert, 'Invalid User Gmail Address')
    } else if (password !== confirmPassword) {
      showAlert(setAlert, 'Passwords do not match')
    } else {
      ipcRenderer.send('user:register', name, email, password, confirmPassword)
    }
  }

  function isGmail (email) {
    var re = /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/
    if (re.test(`${email}`.toLowerCase())) {
      return true
    } else {
      return false
    }
  }

  return (
    <FormContainer>
      <Link to='/' className='btn btn-dark my-3'>
        Go Back
      </Link>
      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <h1>Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label style={{ fontWeight: 'bold' }}>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={e => setName(e.target.value)}
            className='shadow'
          ></Form.Control>
        </Form.Group>

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

        <Form.Group controlId='confirmPassword'>
          <Form.Label style={{ fontWeight: 'bold' }}>
            Confirm Password
          </Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className='shadow'
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='my-3'>
          Register
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          Have an Account?
          <Link to={'/'}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
