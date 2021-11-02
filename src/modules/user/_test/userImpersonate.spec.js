const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../index');
const users = require('../../_test/data');
const expiredToken = require('../../_test/data');

describe('IMPERSONATE', () => {
  for (const role in users) {
    it('User impersonate request as admin', (done) => {
      request(app)
        .post('/user/impersonate')
        .set('Authorization', process.env.TOKEN_ADMIN)
        .send({ userId: process.env[`ID_${role.toUpperCase()}`] })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.userId).to.eq(process.env[`ID_${role.toUpperCase()}`]);
          expect(res.body.token).not.empty;
          done();
        });
    });
  }
});

describe('IMPERSONATE. NEGATIVE', () => {
  for (const role in users) {
    it('Should Not allow impersonate request with role NEW', (done) => {
      request(app)
        .post('/user/impersonate')
        .set('Authorization', process.env.TOKEN_NEW)
        .send({ userId: process.env[`ID_${role.toUpperCase()}`] })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).false;
          expect(res.body.message).not.empty;
          done();
        });
    });
  }

  for (const role in users) {
    it('Should Not allow impersonate request with role BUSINESSOWNER', (done) => {
      request(app)
        .post('/user/impersonate')
        .set('Authorization', process.env.TOKEN_BUSINESSOWNER)
        .send({ userId: process.env[`ID_${role.toUpperCase()}`] })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).false;
          expect(res.body.message).not.empty;
          done();
        });
    });
  }

  for (const role in users) {
    it('Should Not allow impersonate request with invalid token', (done) => {
      request(app)
        .post('/user/impersonate')
        .set('Authorization', invalidToken)
        .send({ userId: process.env[`ID_${role.toUpperCase()}`] })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).false;
          expect(res.body.message).not.empty;
          done();
        });
    });
  }

  for (const role in users) {
    it('should NOT allow impersonate another user without token', (done) => {
      request(app)
        .post('/user/impersonate')
        .set('Authorization', '')
        .send({ userId: process.env[`ID_${role.toUpperCase()}`] })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).false;
          expect(res.body.message).not.empty;
          done();
        });
    });
  }
});
