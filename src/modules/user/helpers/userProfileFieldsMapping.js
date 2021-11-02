const { get } = require('lodash');
const isFulfilled = require('./isFulfilled');
const { countriesWithCode } = require('../../lists/countryList');

module.exports = function userProfileFieldsMapping(body) {
  let firstName = get(body, 'firstName', '');
  let lastName = get(body, 'lastName', '');
  let fullName = get(body, 'fullName', '');

  if (!firstName && !lastName && fullName) {
    const names = fullName.replace(/  +/g, ' ').trim().split(' ');
    firstName = get(names, '[0]', '');
    lastName = get(names, '[1]', '');
  }

  const phone_code = get(body, 'phone_code', '');
  const phone_number = get(body, 'phone_number', '');
  const email = get(body, 'email', '');
  const fax = get(body, 'fax', '');
  const address = get(body, 'address', '');
  const city = get(body, 'city', '');
  const state = get(body, 'state', '');
  const zipCode = get(body, 'zipCode', '');
  const countryName = get(body, 'countryName', null);
  const countryCode = get(
    countriesWithCode.find((el) => el.countryName === countryName),
    'countryCode',
  );

  return {
    name: `${firstName} ${lastName}`.trim(),
    firstName,
    lastName,
    // phone: get(body, 'phone', {}),
    email: get(body, 'email', null),

    phone: {
      code: phone_code,
      number: phone_number,
    },

    personalAddress: {
      countryName,
      countryCode,
      address: get(body, 'address', null),
      city: get(body, 'city', null),
      state: get(body, 'state', null),
      zipCode: get(body, 'zipCode', null),
    },

    fulfilled: !!isFulfilled(body),
  };
};
