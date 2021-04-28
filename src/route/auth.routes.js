const passport = require("passport");
const authController = require("../controller/auth.controller");
require("../auth/auth");

module.exports = function (router) {
  router.post("/login", authController.login);
  router.get(
    "/register",
    passport.authenticate("signup", { session: false }),
    authController.register
  );
};
