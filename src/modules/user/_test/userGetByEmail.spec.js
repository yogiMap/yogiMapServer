const { users } = require('../../_test/data');
const { expect } = require('chai');
const app = require('../../../index');
const request = require('supertest');

const responseStructureGetByEmail = ['_id', 'name', 'firstName', 'lastName', 'roles'];

describe('USER GET BY EMAIL - POSITIVE', () => {
  it('Admin can get new user by email, status 200', (done) => {
    request(app)
      .get(`/user/email/${users.new.email}`)
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.payload).to.include.all.keys(...responseStructureGetByEmail);
        done();
      });
  });
});

describe('USER GET BY EMAIL - NEGATIVE', () => {
  it('Cannot get user by existing email without token', (done) => {
    request(app)
      .get(`/user/email/${users.new.email}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('Cannot get user by existing email with new user token', (done) => {
    request(app)
      .get(`/user/email/${users.new.email}`)
      .set('Authorization', process.env.TOKEN_NEW)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });
});
