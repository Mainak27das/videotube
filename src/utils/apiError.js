const sendError = (res, statusCode, message) => {
    return res.status(statusCode).send({
      success: false,
      message: message,
    });
  };

  export default sendError;