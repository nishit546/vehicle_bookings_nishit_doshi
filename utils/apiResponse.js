/**
 * Standard API Response structure helper
 */
class ApiResponse {
  /**
   * Send a success response
   * @param {Object} res - Express response object
   * @param {string} message - Response message
   * @param {*} data - Payload data
   * @param {number} statusCode - HTTP status code
   */
  static success(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Send an error response
   * @param {Object} res - Express response object
   * @param {string} message - Error description
   * @param {*} error - Error object or details
   * @param {number} statusCode - HTTP status code
   */
  static error(res, message, error = null, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error && error.message ? error.message : error,
    });
  }
}

module.exports = ApiResponse;
