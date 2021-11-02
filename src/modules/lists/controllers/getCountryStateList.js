const { get } = require('lodash');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { countriesWithCode } = require('../countryList');

const getCountryStateList = (req, res) => {
  const userId = get(req, 'user._id', null);
  const country = req.params.country;
  const stateList = [
    ...countriesWithCode.find((el) => el.countryName === country).states,
  ];

  analytics('USER_GET_COUNTRY_STATES_SUCCESS', {
    stateList: stateList,
    user: userId,
  });

  res.status(200).json(message.success('Get country states. Success', stateList));
};

module.exports = getCountryStateList;
