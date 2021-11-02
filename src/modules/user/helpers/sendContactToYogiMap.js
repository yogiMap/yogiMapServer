const axios = require('axios');
const message = require('../../utils/messages');

// {
//    firstName: "Viktor",
//    lastName: "Bogutskii",
//    phone: "17075901867",
//    userId: "5ea14bf12a8f4579d86c253c",
//    email: "i@siteograf.com",
// }

module.exports = function sendContactToCRM(user) {
  return message.success('Contact was NOT sent to CRM. OFF');

  const url = process.env.ZOHO_CRM_CREATE_CONTACT;

  if (url && process.env.NODE_ENV === 'prod') {
    return axios({
      url,
      method: 'POST',
      data: user,
    })
      .then(() => {
        console.log('Contact was sent to CRM');
        return message.success('Contact was sent to CRM');
      })
      .catch((error) => {
        console.log(error);
        return message.fail('Contact was NOT sent to CRM');
      });
  } else {
    return message.fail('No ZOHO webhook url on env is not PROD');
  }
};
