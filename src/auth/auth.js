const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const db = require("./../models");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();
const User = db.User;

//Create a passport middleware to handle user registration
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        //Save the information provided by the user to the the database
        const user_data = {};
        user_data["email"] = email;
        user_data["password"] = await bcrypt.hash(password, 10);
        user_data["firstname"] = req.body.firstname;
        user_data["lastname"] = req.body.lastname;
        const user = await User.create(user_data);
        //Send the user information to the next middleware
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

//Create a passport middleware to handle User login
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        //Find the user associated with the email provided by the user
        const user = await User.findOne({
          where: { email: email },
          include: [
            {
              model: db.Roles,
              as: "roles",
              attributes: ["id", "name"],
              include: {
                model: db.RolePermissions,
                as: "permissions",
                attributes: [
                  "id",
                  "role_id",
                  "permission_id",
                  "create",
                  "read",
                  "edit",
                  "delete",
                ],
                include: {
                  model: db.Permissions,
                  as: "permission_detail",
                  attributes: ["id", "name"],
                },
              },
            },
          ],
        });
        if (!user) {
          //If the user isn't found in the database, return a message
          return done(null, false, { message: "User not found" });
        }
        //Validate password and make sure it matches with the corresponding hash stored in the database
        //If the passwords match, it returns a value of true.
        const validate = await bcrypt.compare(password, user.password);
        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }
        //Send the user information to the next middleware
        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      //secret we used to sign our JWT
      secretOrKey: process.env.JWT_SECRET,
      //we expect the user to send the token as a query parameter with the name 'secret_token'
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        //Pass the user details to the next middleware
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
