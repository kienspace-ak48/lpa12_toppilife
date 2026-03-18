const adminRoute = require("./adminRoute.route");
const authMiddleware = require("../middlewares/auth.middleware");
const authRoute = require("./auth.route");

function routes(app) {
  app.use('/auth', authRoute)
  app.use("/admin",authMiddleware, adminRoute);
}

module.exports = routes;
