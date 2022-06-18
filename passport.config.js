const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(pass, getUserByEmail, getUserById) {
  const authenticateUser = async (email, pass, done) => {
    const user = getUserByEmail(email);
    if (user === undefined) {
      return done(null, false, { message: "No such User Exists!!" });
    }
    try {
      console.log(email);
      console.log(user);
      if (await bcrypt.compare(pass, user.pass)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password Incorrect!!" });
      }
    } catch (e) {
      done(e);
    }
  };

  pass.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "pass" },
      authenticateUser
    )
  );
  pass.serializeUser((user, done) => {
    done(null, user.id);
  });
  pass.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
}

module.exports = initialize;
