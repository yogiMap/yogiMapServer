const bodyParser = require('body-parser');

module.exports = function parseResponse(app) {
  app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
  app.use(bodyParser.json()); // support json encoded bodies
};
