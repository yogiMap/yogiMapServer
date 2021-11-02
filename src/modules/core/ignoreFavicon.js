module.exports = function ignoreFavicon(app) {
  app.get('/favicon.ico', (req, res) => res.status(204));
};
