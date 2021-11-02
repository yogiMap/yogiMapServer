const twilio = require('twilio');
const Client = require('../../../client/Model');
const escapeRegExp = require('../../../utils/escapeRegExp');
const message = require('../../../utils/messages');
const messageCreateQuery = require('../queries/create');
const { get } = require('lodash');
const mongoose = require('mongoose');
const sipPhoneGetByPhoneNumberQuery = require('../../../sipPhone/queries/getByPhoneNumber');

const MessagingResponse = twilio.twiml.MessagingResponse;

module.exports = async (req, res) => {
  const messageBody = get(req, 'body.Body', '');
  const direction = 'inbound-api';
  const phoneNumber = get(req, 'body.From', '');
  const to = get(req, 'body.To', '');

  const twiml = new MessagingResponse();

  const sipPhoneGetByPhoneNumberResult = await sipPhoneGetByPhoneNumberQuery(to);

  console.log(sipPhoneGetByPhoneNumberResult);

  if (sipPhoneGetByPhoneNumberResult.fail) {
    res.writeHead(400, { 'Content-Type': 'text/xml' });
    return res.end(twiml.toString());
  }

  const teacherAccount = get(
    sipPhoneGetByPhoneNumberResult,
    'payload.teacherAccount',
    '',
  );

  const _id = new mongoose.Types.ObjectId();

  const queryClient = {};

  if (phoneNumber && teacherAccount) {
    queryClient['phoneNumber1.number'] = {
      $regex: escapeRegExp(phoneNumber.slice(2)), // +17075901867 -> 7075901867
      $options: 'i',
    };

    queryClient.teacherAccount = teacherAccount;
  }

  const clientSearchQueryResult = await clientSearchQuery({ query: queryClient });

  if (clientSearchQueryResult.fail) {
    // twiml.message('Client not found');
    res.writeHead(400, { 'Content-Type': 'text/xml' });
    return res.end(twiml.toString());
  }

  const ownerId = get(clientSearchQueryResult, 'payload.owner');
  const clientId = get(clientSearchQueryResult, 'payload._id');
  const teacherAccountId = get(clientSearchQueryResult, 'payload.teacherAccount');

  const sms = {
    _id,
    client: clientId,
    owner: ownerId,
    messageBody,
    direction,
    from: phoneNumber,
    to,
    teacherAccount: teacherAccountId,
  };

  const messageCreateResult = await messageCreateQuery(sms);
  // const clientAddMessageQueryResult = await clientAddMessageQuery(client, _id);

  console.log(messageCreateResult);

  // twiml.message('MESSAGE SUCCESSFULLY SENT');
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
};

function clientSearchQuery({ query }) {
  return Client.findOne(query)
    .exec()
    .then((doc) => {
      return message.success('Client found', doc);
    })
    .catch((error) => message.fail('Client search', error));
}
