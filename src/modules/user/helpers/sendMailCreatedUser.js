const sendEmailViaAwsSes = require('../../mail/sesClient');

async function sendMailCreatedUser({
  email,
  emailHashConfirmation,
  firstName,
  lastName,
  userId,
}) {
  const host = process.env.CLIENT_HOST;
  const link = `${host}/user/verify/email/${userId}/${emailHashConfirmation}`;
  const subject = '[YogiMap] Verify your email';

  const message = {
    html: `Hi ${firstName} ${lastName},<br/>
          You registered at <a href=${host}>${host}</a>
          <br/><br/>
          Please, verify your email address <a href=${link}>click here</a>
          <br/><br/>
          Thanks,<br/>
          Your friends at YogiMap`,
    text: `Hi ${firstName} ${lastName},\nYou registered at ${host}\n\nPlease, verify your email address click the link below\n${link}\n\nThanks,\nYour friends at YogiMap`,
  };

  console.log(message);

  return sendEmailViaAwsSes(email, subject, message);
}

module.exports = sendMailCreatedUser;
