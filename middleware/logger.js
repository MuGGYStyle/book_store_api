const logger = (req, res, next) => {
  console.log(req.cookies);

  console.log(`${req.method} ${req.protocol}://${req.host}${req.originalUrl}`);

  next();
};

module.exports = logger;
