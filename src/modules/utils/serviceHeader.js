const serviceHeader = (controller) => (req, res, next) => {
  res.set('CCC', controller);
  next();
};

module.exports = serviceHeader;
