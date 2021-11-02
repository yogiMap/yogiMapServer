const { get } = require('lodash');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { countriesWithCode } = require('../countryList');

const getCountryList = (req, res) => {
  const userId = get(req, 'user._id', null);
  const countriesList = [...countriesWithCode.map((el) => el.countryName)];

  analytics('USER_GET_ALL_COUNTRIES_SUCCESS', {
    countries: countriesList,
    user: userId,
  });

  res.status(200).json(message.success('Get all countries. Success', countriesList));
};

module.exports = getCountryList;
