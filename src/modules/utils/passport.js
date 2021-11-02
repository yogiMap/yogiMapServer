const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../user/userModel');
const passportConfig = require('../core/passportConfig');

module.exports = function (passport) {
  //============ LOCAL
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      //Match User
      User.findOne({ email: email })
        .select('+password')
        .then((user) => {
          if (!user) {
            return done(null, false, { message: 'Email is not registered' });
          }

          //Match password
          bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) throw error;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Incorrect password' });
            }
          });
        })
        .catch((error) => console.log(error));
    }),
  );

  //============ GOOGLE
  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: passportConfig.oauth.googleAuth.clientID,
        clientSecret: passportConfig.oauth.googleAuth.clientSecret,
        callbackURL: passportConfig.oauth.googleAuth.callbackURL,
      },
      function (request, accessToken, refreshToken, profile, done) {
        process.nextTick(() => {
          done(null, profile);
        });
      },
    ),
  );

  //============ FACEBOOK
  passport.use(
    'facebook',
    new FacebookStrategy(
      {
        clientID: passportConfig.oauth.facebookAuth.clientID,
        clientSecret: passportConfig.oauth.facebookAuth.clientSecret,
        callbackURL: passportConfig.oauth.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName', 'name', 'gender', 'emails', 'photos'],
      },
      function (accessToken, refreshToken, profile, done) {
        process.nextTick(() => {
          done(null, profile);
        });
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    });
  });
};
