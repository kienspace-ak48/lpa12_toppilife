function responseMiddleware(req, res, next) {
  res.success = (data = null, status = 200) => {
    res.status(status).json({
      success: true,
      data,
    });
  };
  res.error = (mess = "Server error", status = 500) => {
    res.status(status).json({
      success: false,
      error: mess,
    });
  };
  next();
}

module.exports = responseMiddleware;
