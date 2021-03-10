const errorHandler = (err, req, res, next) => {
  console.log(err.stack.cyan);

  const error = { ...err };

  error.message = err.message;

  res.status(error.statusCode || 500).json({
    success: false,
    error,
  });
};

module.exports = errorHandler;
