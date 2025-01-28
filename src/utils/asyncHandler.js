const asyncHandler = (fn) => async (req, res, next) => {
  // to wrap any function into try catch and ansync and await using higher order function
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};
export { asyncHandler };
