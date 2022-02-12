const express = require('express')
const router = express.Router()
const {
  getAllLogs,
  getMyLogs,
  addLog,
  deleteLog,
  getLog,
  updateLog,
  clearAllLogs
} = require('../controllers/logController')
const protect = require('../middleware/authMiddleware')

router
  .route('/')
  .get(getAllLogs)
  .post(protect, addLog)
  .delete(protect, clearAllLogs)
router.route('/mylogs').get(protect, getMyLogs)
router
  .route('/:id')
  .delete(protect, deleteLog)
  .get(protect, getLog)
  .put(protect, updateLog)

module.exports = router
