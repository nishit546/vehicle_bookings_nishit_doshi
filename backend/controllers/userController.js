const User = require('../models/User')
const ApiResponse = require('../utils/apiResponse')
const asyncHandler = require('../utils/asyncHandler')
const paginate = require('../utils/paginate')
const { generateToken } = require('../utils/auth')

const getUsers = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, search, role } = req.query
  const query = { isDeleted: false }
  if (role) query.role = role
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
  }
  const data = await paginate(User, query, { page, limit, sortBy: sortBy || 'createdAt:desc' })
  return ApiResponse.success(res, 'Users fetched successfully.', data, 200)
})

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, isDeleted: false })
  if (!user) return ApiResponse.error(res, 'User not found.', null, 404)
  return ApiResponse.success(res, 'User fetched successfully.', user, 200)
})

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, customerId } = req.body
  const exists = await User.findOne({ email })
  if (exists) return ApiResponse.error(res, 'Email already in use.', null, 400)
  const user = await User.create({ name, email, password, role: role || 'user', customerId: customerId || null })
  const token = generateToken(user._id)
  return ApiResponse.success(res, 'User created successfully.', { user: { id: user._id, name: user.name, email: user.email, role: user.role, customerId: user.customerId }, token }, 201)
})

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, isDeleted: false })
  if (!user) return ApiResponse.error(res, 'User not found.', null, 404)
  const { name, email, role, customerId } = req.body
  if (name !== undefined) user.name = name
  if (email !== undefined) user.email = email
  if (role !== undefined) user.role = role
  if (customerId !== undefined) user.customerId = customerId
  await user.save()
  return ApiResponse.success(res, 'User updated successfully.', { id: user._id, name: user.name, email: user.email, role: user.role, customerId: user.customerId }, 200)
})

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, isDeleted: false })
  if (!user) return ApiResponse.error(res, 'User not found.', null, 404)
  user.isDeleted = true
  await user.save()
  return ApiResponse.success(res, 'User deleted successfully.', null, 200)
})

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser }
