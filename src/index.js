const express = require('express');
const { mongoConnection } = require('./modules/core/db');
const logger = require('./modules/core/logger');
const parseResponse = require('./modules/core/parseResponse');
const ignoreFavicon = require('./modules/core/ignoreFavicon');
const routes = require('./modules/core/routes');
const cors = require('./modules/core/cors');
const session = require('./modules/core/session');
const passport = require('passport');
const errorHandling = require('./modules/core/errorHandling');
const pause = require('./modules/core/pause');

const chai = require('chai');
chai.use(require('chai-datetime'));

const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");

// Passport
require('./modules/utils/passport')(passport);

const app = express();
app.set('trust proxy', 1);
const PORT = +process.env.PORT || 5000;
Sentry.init({ dsn: process.env.SENTRY, tracesSampleRate: 1.0 });
// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
app.disable('x-powered-by'); // DISABLE EXPRESS SIGNATURE
mongoConnection();
logger(app);
ignoreFavicon(app);
parseResponse(app);
cors(app);
session(app);
pause(app);
routes(app);
app.use(Sentry.Handlers.errorHandler());
errorHandling(app);

// The error handler must be before any other error middleware and after all controllers

// Optional fallthrough error handler
app.use(function onError(err, req, res) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + '\n');
});

// ===== PORT =====
app.listen(PORT, () => {
  console.log(
    `Node cluster worker ${process.pid}: listening on port ${PORT} - env: ${process.env.NODE_ENV}`,
  );
});

module.exports = app;
