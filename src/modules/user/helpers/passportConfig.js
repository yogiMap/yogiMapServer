const User = require('../userModel');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (error, user) => {
        if (error) throw error;
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (error, result) => {
          if (error) throw error;
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    }),
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (error, user) => {
      cb(error, user);
    });
  });
};
