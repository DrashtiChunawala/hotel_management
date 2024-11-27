const LocalStrategy = require("passport-local").Strategy;
const Person = require("./models/Person");
const passport = require("passport");

//logic for authenticating user credentials for login purposes
passport.use(
new LocalStrategy(async (USERNAME, PASSWORD, done) => {
      console.log('USERNAME', USERNAME)
      try {
        // console.log("Received credentials", username, password);
        const user =await Person.findOne({ username: USERNAME });
        if (!user) {
          return done(null, false, { message: "User does not exists" });
        }
        const isPasswordMatch = await user.comparePassword(PASSWORD,user.password);
        if (!isPasswordMatch) {
          return done(null, false, { message: "Incorrect password" });
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    })
  );

  //end of logic now pass the middleware function to the route in this case passed to person data in server.js

  module.exports = passport