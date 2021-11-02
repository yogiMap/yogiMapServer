const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../index');
const users = require('../../_test/data');

process.env.HASH_NEW = null;
process.env.HASH_BUSINESSOWNER = null;
process.env.HASH_ADMIN = null;

describe('USER PASSWORD RESET - POSITIVE', () => {
  for (const role in users) {
    it(`Verify as ${role} userPasswordResetRequest`, (done) => {
      request(app)
        .post('/user/password/reset/request')
        .send(users[role])
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).true;
          expect(res.body.message).to.eq('Check mail for reset password link');
          done();
        });
    });

    it(`Getting Hash for ${role}`, (done) => {
      request(app)
        .get(`/user/hash/${process.env[`ID_${role.toUpperCase()}`]}`)
        .set('Authorization', process.env.TOKEN_ADMIN)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          process.env[`HASH_${role.toUpperCase()}`] = res.body.payload.hash;
          console.log(`=========HASH_${role}====================`);
          console.log(process.env[`HASH_${role.toUpperCase()}`]);
          expect(res.body.success).true;
          expect(res.body.message).to.eq('User get hash. Success');
          done();
        });
    });

    it(`Verify ${role} User Reset is valid link`, (done) => {
      request(app)
        .post('/user/password/reset/valid')
        .send({
          userId: process.env[`ID_${role.toUpperCase()}`],
          hash: process.env[`HASH_${role.toUpperCase()}`],
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).true;
          expect(res.body.message).to.eq('Valid link');
          done();
        });
    });

    it(`Verify ${role} User Reset password new`, (done) => {
      request(app)
        .post('/user/password/reset/new')
        .send({
          userId: process.env[`ID_${role.toUpperCase()}`],
          hash: process.env[`HASH_${role.toUpperCase()}`],
          password: 'Qq123!',
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).true;
          expect(res.body.message).to.eq('Your password has been changed successfully');
          done();
        });
    });
  }
});
