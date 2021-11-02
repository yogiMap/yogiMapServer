const { difference, upperFirst } = require('lodash');
const sendEmailViaAwsSes = require('../../mail/sesClient');

async function notifyAboutNewRole({ currentRoles, newRoles, email, name }) {
  const newRole = difference(newRoles, currentRoles).filter((el) => el !== 'new')[0];

  if (newRole) {
    const host = process.env.CLIENT_HOST;

    const emailMessage = {
      html: `Hi ${name},<br/>
          You got a new role – ${upperFirst(newRole)}
          <br/><br/>
          Check your account for updates. <a href=${host}>Go to app</a>
          <br/><br/>
          Thanks,<br/>
          Your friends at YogiMap`,
      text: `Hi ${name},\nYou got a new role – ${upperFirst(
        newRole,
      )}\n\nCheck your account for updates. Go to ${host}\n\nThanks,\nYour friends at YogiMap`,
    };

    const subject = '[YogiMap] New role';

    await sendEmailViaAwsSes(email, subject, emailMessage);
  }
}

module.exports = notifyAboutNewRole;
