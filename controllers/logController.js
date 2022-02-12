const asyncHandler = require('express-async-handler')
const Log = require('../models/Log')
const User = require('../models/User')
const generateEmail = require('../utils/generateMail.js')

//@desc           Get all logs
//@route          GET /api/logs
//access          Public
const getAllLogs = asyncHandler(async (req, res) => {
  const logs = await Log.find()
    .sort({ created: 1 })
    .populate('user', 'id name')
  if (logs) {
    res.json(logs)
  } else {
    res.status(401)
    throw new Error('Logs not found')
  }
})

//@desc           Get logs by user
//@route          GET /api/logs/mylogs
//access          Public
const getMyLogs = asyncHandler(async (req, res) => {
  const logs = await Log.find({ user: req.user._id }).populate(
    'user',
    'id name'
  )
  if (logs) {
    res.json(logs)
  } else {
    res.status(400)
    throw new Error('No personal logs found')
  }
})

//@desc           Create new log
//@route          POST /api/logs
//access          Private
const addLog = asyncHandler(async (req, res) => {
  const { text, platform, priority, description, image } = req.body
  const log = new Log({
    user: req.user._id,
    text,
    platform,
    priority,
    description,
    image
  })
  const createdLog = await log.save()
  let emails = await User.find({}, { email: 1, _id: 0 })
  emails = emails.map(email => {
    return email.email
  })
  const str = emails.join(',')
  generateEmail(str)
  res.status(201).json(createdLog)
})

//@desc           Delete a log
//@route          DELETE /api/logs/:id
//access          Private
const deleteLog = asyncHandler(async (req, res) => {
  const id = req.params.id
  const log = await Log.findById(id)
  if (log) {
    await Log.findOneAndDelete({ _id: id })
    res.json('DELETED LOG')
  } else {
    res.status(404)
    throw new Error('Log not found')
  }
})

//@desc           Get a single log
//@route          GET /api/logs/:id
//access          Private
const getLog = asyncHandler(async (req, res) => {
  const id = req.params.id
  const log = await Log.findById(id).populate('user', 'id name')
  if (log) {
    res.json(log)
  } else {
    res.status(404)
    throw new Error('Log not found')
  }
})

//@desc           Update a single log
//@route          PUT /api/logs/:id
//access          Private
const updateLog = asyncHandler(async (req, res) => {
  const id = req.params.id
  const log = await Log.findById(id)
  if (log) {
    log.solutionLink = req.body.solutionLink || log.solutionLink
    log.solution = req.body.solution || log.solution

    const updatedLog = await log.save()
    res.json({
      _id: updatedLog._id,
      solution: log.solution,
      solutionLink: log.solutionLink
    })
  } else {
    res.status(404)
    throw new Error('Log not found')
  }
})

//@desc           Delete all logs
//@route          DELETE /api/logs
//access          Private
const clearAllLogs = asyncHandler(async (req, res) => {
  if (req.user) {
    await Log.deleteMany({})
    res.json('DELETED ALL LOGS')
  }
})

module.exports = {
  getAllLogs,
  getMyLogs,
  addLog,
  deleteLog,
  getLog,
  updateLog,
  clearAllLogs
}
