const request = require('supertest');
const app = require('../../../index');

function baseCreate(base, token) {
  return request(app).post('/base').set('Authorization', token).send(base);
}

function baseGetById(baseId, token) {
  return request(app).get(`/base/${baseId}`).set('Authorization', token);
}

module.exports = {
  baseCreate,
  baseGetById,
};
