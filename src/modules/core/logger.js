const morgan = require('morgan');

module.exports = function logger(app) {
  app.use(morgan('dev'));
};
