const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a given user ID
 * @param {string} id - The user ID
 * @returns {string} JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  });
};

module.exports = { generateToken };
