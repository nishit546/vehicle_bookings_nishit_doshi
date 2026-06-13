const express = require('express')
const { protect, authorize } = require('../middlewares/auth')
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController')

const router = express.Router()

router.use(protect)

router.route('/')
  .get(authorize('admin'), getUsers)
  .post(authorize('admin'), createUser)

router.route('/:id')
  .get(authorize('admin'), getUserById)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser)

module.exports = router
