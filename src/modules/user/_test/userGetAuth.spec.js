const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../index');
const users = require('../../_test/data');
const { invalidToken } = require('./data');

describe('USER AUTH ', () => {
  for (const role in users) {
    it('User auth', (done) => {
      request(app)
        .get('/user/auth')
        .set('Authorization', process.env[`TOKEN_${role.toUpperCase()}`])
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).true;
          done();
        });
    });
  }
});

describe('USER AUTH NEGATIVE', () => {
  it('Should NOT get authorization for user without token', (done) => {
    request(app)
      .get('/user/auth')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('Should NOT get authorization for user with invalid token', (done) => {
    request(app)
      .get('/user/auth')
      .set('Authorization', invalidToken)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });
});
