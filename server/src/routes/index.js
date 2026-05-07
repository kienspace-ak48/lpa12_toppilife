const adminRoute = require("./adminRoute.route");
const authMiddleware = require("../middlewares/auth.middleware");
const authRoute = require("./auth.route");
const apiRoute = require('./api.route');

function noStore(req, res, next) {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
}

function routes(app) {
  app.use('/api', apiRoute)
  app.use('/auth', authRoute)
  app.use("/admin", authMiddleware, adminRoute);
}

module.exports = routes;
