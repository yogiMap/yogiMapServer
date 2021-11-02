const request = require('supertest');
const app = require('../../../index');

describe('route Info', () => {
  it('GET /info', (done) => {
    request(app)
      .get('/info')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
