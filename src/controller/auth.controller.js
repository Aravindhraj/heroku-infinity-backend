const dotenv = require("dotenv");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { apiSuccess, apiError } = require("../helpers/response.helper");

require("../auth/auth");
dotenv.config();

exports.register = async (req, res, next) => {
  res.status(200).json({
    message: "Signup successful",
  });
};

exports.login = async function (req, res, next) {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        return apiError(res, info["message"], true, 422);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = {
          _id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: {
            id: user.roles[0]["id"],
            name: user.roles[0]["name"],
          },
          permissions: user.roles[0]["permissions"],
        };
        // return apiSuccess(res, user.roles);
        //Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
          expiresIn: 86400//86400 // expires in 24 hours
        });
        //Send back the token to the user

        return apiSuccess(
          res,
          { user: body, token: token },
          "Successfully LoggedIn",
          true
        );
        // return res.status(200).json({ user: body, token: token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};
