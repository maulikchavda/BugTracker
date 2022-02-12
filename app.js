const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const userRoutes = require('./routes/userRoutes')
const logRoutes = require('./routes/logRoutes')
const uploadRoutes = require('./routes/uploadRoutes')

dotenv.config()

const app = express()

app.use(express.json())
app.get('/', (req, res) => {
  res.send({
    data: 'Welcome to Bug Logger'
  })
})

app.use('/api/logs', logRoutes)
app.use('/api/users', userRoutes)
app.use('/api/upload', uploadRoutes)

console.log(`Upload directory: ${path.join(__dirname, '/uploads')}`)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running on port ${PORT}`))
