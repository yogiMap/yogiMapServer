const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../index');
const client = require('./data');
const Client = require('../Model');

describe('CREATE CLIENT AS BUSINESS OWNER', () => {
  after(() => {
    return Client.deleteOne({ email: client.email });
  });

  before(() => {
    return Client.deleteOne({ email: client.email });
  });

  it('Should create new client', (done) => {
    request(app)
      .post('/client')
      .set('Authorization', process.env.TOKEN_TEACHER)
      .send(client)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });
});

describe('SEARCH CLIENT AS TEACHER', () => {
  it('should search by name', (done) => {
    request(app)
      .post('/client/search')
      .set('Authorization', process.env.TOKEN_TEACHER)
      .send({
        firstName: 'Blala',
        lastName: 'Kiehn',
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });

  it('should search by company name', (done) => {
    request(app)
      .post('/client/search')
      .set('Authorization', process.env.TOKEN_TEACHER)
      .send(client.email)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });
});
