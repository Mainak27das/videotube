const apiError = (res, statusCode, message) => {
    return res.status(statusCode).send({
      success: false,
      message: message,
    });
  };

export {apiError}  