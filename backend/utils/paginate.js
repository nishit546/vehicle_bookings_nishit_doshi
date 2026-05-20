/**
 * Reusable Mongoose pagination utility
 * @param {Object} model - The Mongoose Model
 * @param {Object} query - MongoDB query filter object
 * @param {Object} options - Pagination options (page, limit, sortBy, projection)
 * @returns {Promise<Object>} Object containing results and pagination metadata
 */
const paginate = async (model, query = {}, options = {}) => {
  const page = parseInt(options.page, 10) || 1;
  const limit = Math.min(parseInt(options.limit, 10) || 10, 100); // Caps limit to 100
  const skip = (page - 1) * limit;

  // Build Sorting Object
  let sort = {};
  if (options.sortBy) {
    const parts = options.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  } else {
    sort = { date: -1 }; // Default sort by booking date descending
  }

  // Build Projection (default is empty object to include all fields)
  const projection = options.projection || {};

  // Fetch count and results concurrently
  const [total, results] = await Promise.all([
    model.countDocuments(query),
    model.find(query, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    results,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = paginate;
