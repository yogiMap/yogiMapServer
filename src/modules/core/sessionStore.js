const Config = require('./passportConfig');
const session = require('express-session');
const mongoose = require('mongoose');

const MongoStore = require('connect-mongo')(session);
const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connect(Config.mongoose.uri, Config.mongoose.options),
});

module.exports = sessionStore;
