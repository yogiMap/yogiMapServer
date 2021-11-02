const message = require('../../../utils/messages');
const { get } = require('lodash');
const createCall = require('../queries/create');
const sipPhoneGetByOwnerIdQuery = require('../../../sipPhone/queries/getByOwnerId');

const statusCallback = async (req, res) => {
  console.log('==================== STATUS =================================');

  const caller = get(req, 'body.Caller', '');
  let direction = 'incoming';
  let callerSipPhone = null;
  const callSid = get(req, 'body.CallSid');

  //  Это предположение что если начинается с client: то это исходящий
  // if (caller.startsWith('client:')) {
  //   direction = 'outgoing');
  //   const callerUserId = caller.slice(7); // get id from 'client:60d234032dbd1138752a09e9'
  //   callerSipPhone = await sipPhoneGetByOwnerIdQuery(callerUserId)
  // }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);

  setTimeout(() => {
    client
      .calls(callSid)
      .fetch()
      .then((call) => console.log(call));
  }, 3000);

  // const callCreateResult = await createCall({
  //   callSid,
  //   direction,
  //   callerSipPhone,
  //   rawLog: req.body
  // })

  // console.log(callCreateResult)

  console.log('==============================================================');

  return res.status(200).json(message.success('Status'));
};

module.exports = statusCallback;
