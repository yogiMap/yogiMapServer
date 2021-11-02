const twilio = require('twilio');
const Client = require('../../../client/Model');
const escapeRegExp = require('../../../utils/escapeRegExp');
const message = require('../../../utils/messages');
const messageCreateQuery = require('../queries/create');
const clientAddMessageQuery = require('../../../client/queries/addMessage');
const User = require('../../../user/userModel');
const { get } = require('lodash');
const mongoose = require('mongoose');

const http = require('http');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
module.exports = async () => {
  return http
    .createServer((req, res) => {
      // Create TwiML response
      const twiml = new VoiceResponse();

      twiml.say('Hello from your pals at Twilio! Have fun.');

      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twiml.toString());
    })
    .listen(5000, '127.0.0.1');

  console.log('TwiML server running at http://127.0.0.1:5000/');
};
