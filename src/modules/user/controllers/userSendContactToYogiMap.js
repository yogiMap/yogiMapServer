const message = require('../../utils/messages');
const userGetByIdQuery = require('../queries/getById');
const sendContactToCRM = require('../helpers/sendContactToYogiMap');

const userSendContactToYogiMap = async (req, res) => {
  const { userId } = req.params;

  // get user by id to get email
  const getUserByIdResult = await userGetByIdQuery(userId);

  if (getUserByIdResult.success) {
    const sendContactToCrmResult = await sendContactToCRM(getUserByIdResult.payload);

    if (sendContactToCrmResult.success) {
      return res.status(200).json(message.success('Contact was sent. Success'));
    } else {
      return res.status(400).json(message.fail('Contact to CRM. Sending. Error'));
    }
  } else {
    return res.status(400).json(message.fail('Contact to CRM. Get user. Error'));
  }
};

module.exports = userSendContactToYogiMap;
