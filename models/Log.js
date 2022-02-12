const mongoose = require('mongoose')

const LogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  text: {
    type: String,
    trim: true,
    required: [true, 'Log title is required']
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: true,
    default: ''
  },
  priority: {
    type: String,
    default: 'low',
    enum: ['low', 'moderate', 'high']
  },
  platform: {
    type: String,
    trim: true,
    required: [true, 'platform is required']
  },
  created: {
    type: Date,
    default: Date.now()
  },
  solution: {
    type: String,
    default: ''
  },
  solutionLink: {
    type: String,
    default: ''
  }
})

module.exports = mongoose.model('Log', LogSchema)
