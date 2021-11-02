const request = require('supertest');
const app = require('../../../index');

function sipPhoneCreate(sipPhone, token) {
  return request(app).post('/sipPhone').set('Authorization', token).send(sipPhone);
}

function sipPhoneGetById(sipPhoneId, token) {
  return request(app).get(`/sipPhone/${sipPhoneId}`).set('Authorization', token);
}

module.exports = {
  sipPhoneCreate,
  sipPhoneGetById,
};
