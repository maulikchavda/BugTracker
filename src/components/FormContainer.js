import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className='justify-content-md-center my-5'>
        <Col md={12}>{children}</Col>
      </Row>
    </Container>
  )
}

export default FormContainer
