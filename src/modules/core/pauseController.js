const pauseController = (req, res, next) => {
  setTimeout(() => next(), 0);
};

module.exports = pauseController;
