const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../index');
const badUserId = '000000000000000000000000'; // 609b7d8083787478667e8709
const expiredToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInVzZXJJZCI6IjYwOWNiOTg3OGYyNGQ3MDkzNGJhMjY0ZCIsImlhdCI6MTYyMDg4Mzg0NywiZXhwIjoxNjIxNzQ3ODQ3fQ.tsSle1wPlsrBvNfZICXCL7ZznZ8FyjWtMvpfjcpTug4';
const users = require('../../_test/data');

describe('USER UPDATE SELF', () => {
  for (const role in users) {
    it(`Admin can get ${role} hash`, (done) => {
      request(app)
        .get(`/user/hash/${process.env[`ID_${role.toUpperCase()}`]}`)
        .set('Authorization', process.env.TOKEN_ADMIN)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).true;
          done();
        });
    });
  }

  it('Admin cant get unregistered user hash', (done) => {
    request(app)
      .get(`/user/hash/${badUserId}`)
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect(404)
      .end((err, res) => {
        expect(res.body.success).false;
        done();
      });
  });

  ['new', 'businessOwner'].forEach((user) => {
    for (const role in users) {
      it(`${user} cant get ${role} hash`, (done) => {
        request(app)
          .get(`/user/hash/${process.env[`ID_${role.toUpperCase()}`]}`)
          .set('Authorization', process.env[`TOKEN_${user.toUpperCase()}`])
          .expect(400)
          .end((err, res) => {
            expect(res.body.success).false;
            done();
          });
      });
    }
    it(`${user} cant get unregistered user hash`, (done) => {
      request(app)
        .get(`/user/hash/${badUserId}`)
        .set('Authorization', process.env[`TOKEN_${user.toUpperCase()}`])
        .expect(400)
        .end((err, res) => {
          expect(res.body.success).false;
          done();
        });
    });
  });
  for (const role in users) {
    it(`User with bad token cant get ${role} hash`, (done) => {
      request(app)
        .get(`/user/hash/${process.env[`ID_${role.toUpperCase()}`]}`)
        .set('Authorization', expiredToken)
        .expect(400)
        .end((err, res) => {
          expect(res.body.success).false;
          done();
        });
    });
  }
});
