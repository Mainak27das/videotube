const sendSuccess = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
  });
};
const sendError = (res, statusCode, message) => {
  return res.status(statusCode).send({
    success: false,
    message: message,
  });
};

export { sendSuccess, sendError };
