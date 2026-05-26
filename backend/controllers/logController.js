const Log = require('../models/Log');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Delete a log record by ID
 * @route   DELETE /api/v1/logs/:id
 * @access  Private
 */
const deleteLog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let log = await Log.findByIdAndDelete(id);
  if (!log) {
    // If not standard Mongoose ObjectId, try searching by a custom id or string
    log = await Log.findOneAndDelete({ _id: id });
  }

  if (!log) {
    return ApiResponse.error(res, `Log record with ID ${id} not found.`, null, 404);
  }

  return ApiResponse.success(res, `Log record ${id} deleted successfully.`, null, 200);
});

module.exports = {
  deleteLog,
};
