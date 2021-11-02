const User = require('../../userModel');
const message = require('../../../utils/messages');
const analytics = require('../../../analytics/controllers/analytics');
const { get } = require('lodash');
const userUpdateByIdQuery = require('../../queries/updateById');
const sendMailCreatedUser = require('../../helpers/sendMailCreatedUser');

const userVerifyEmailSend = (req, res) => {
  const userId = get(req, 'body.userId', '');
  const newEmail = get(req, 'body.email', '');

  User.findById(userId)
    .select('+emailConfirmation.hash')
    .exec()
    .then(async (doc) => {
      if (doc) {
        const isEmailConfirmed = get(doc, 'emailConfirmation.confirmed', false);
        if (newEmail !== doc.email) {
          await userUpdateByIdQuery({ userId, values: { email: newEmail } });
        }

        if (!isEmailConfirmed) {
          const email = doc.email;
          const emailHashConfirmation = doc.emailConfirmation.hash;
          const name = get(doc, 'name', '');

          const sendEmail = await sendMailCreatedUser({
            email,
            emailHashConfirmation,
            name,
            userId,
          });

          // TODO only for development. Turn off after production
          const host = process.env.CLIENT_HOST;
          const link = `${host}/user/verify/email/${userId}/${emailHashConfirmation}`;
          sendEmail.dev = link;

          if (sendEmail.success) {
            return res.status(200).json(sendEmail);
          } else {
            return res.status(400).json(sendEmail);
          }
        } else {
          const reason = 'Email already confirmed';
          //
          const analyticsId = analytics('USER_VERIFY_EMAIL_SEND_FAIL', {
            reason,
            user: userId,
          });

          res.status(400).json(message.fail(reason, analyticsId));
        }
      } else {
        const reason = 'User for sending email not found';
        //
        const analyticsId = analytics('USER_VERIFY_EMAIL_SEND_FAIL', {
          reason,
          user: userId,
          controller: 'userVerifyEmailSend',
        });

        res.status(400).json(message.fail(reason, analyticsId));
      }
    })

    .catch((error) => {
      //
      const analyticsId = analytics('USER_VERIFY_EMAIL_SEND_ERROR', {
        error,
        body: req.body,
        controller: 'userVerifyEmailSend',
      });

      res.status(400).json(message.fail('Send email. Error', analyticsId));
    });
};

module.exports = userVerifyEmailSend;
