const { get } = require('lodash');

module.exports = function isFulfilled(user) {
  return (
    get(user, 'links.linkedIn') &&
    get(user, 'links.facebook') &&
    get(user, 'links.resume') &&
    get(user, 'links.github') &&
    get(user, 'links.codewarsUsername') &&
    get(user, 'about') &&
    get(user, 'goals') &&
    get(user, 'englishLevel')
  );
};
