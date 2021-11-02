const cookieParser = require('cookie-parser');
const sessionExpress = require('express-session');
const passportConfig = require('./passportConfig');
const MongoStore = require('connect-mongo');
const passport = require('passport');

module.exports = function session(app) {
  app.use(cookieParser());
  // Express session
  app.use(
    sessionExpress({
      secret: passportConfig.session.secret,
      resave: true,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_CONNECTION_STRING,
        collectionName: passportConfig.session.collection,
      }),
      cookie: passportConfig.session.cookie,
    }),
  );
  // Passport
  app.use(passport.initialize());
  // Allows to use with cookies and get data from Social profiles after login
  app.use(passport.session());
};
