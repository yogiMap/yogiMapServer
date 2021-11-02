const app = require('../../../index');
const request = require('supertest');
const { expect } = require('chai');
const users = require('../../_test/data');

describe('USER UPDATE ROLE BY ID POSITIVE', () => {
  it('Change role from NEW to BUSINESSOWNER', (done) => {
    request(app)
      .patch(`/user/${process.env.ID_NEW}`)
      .set('Authorization', process.env.TOKEN_ADMIN)
      .send({ roles: ['businessOwner'] })
      .expect(200)
      .end((err, res) => {
       if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });

  it('USER LOGIN WITH NEW ROLE', (done) => {
    request(app)
      .post('/user/login')
      .send({ email: users.new.email, password: users.new.password })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.payload.user.roles.join('')).eq('businessOwner');
        done();
      });
  });
});

describe('USER UPDATE ROLE BY ID NEGATIVE', () => {
  it('BUSINESSOWNER CAN NOT UPDATE ROLE BY ID', (done) => {
    request(app)
      .patch(`/user/${process.env.ID_NEW}`)
      .set('Authorization', process.env.TOKEN_BUSINESSOWNER)
      .send({ roles: ['businessOwner'] })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('NEW USER CAN NOT UPDATE ROLE BY ID', (done) => {
    request(app)
      .patch(`/user/${process.env.ID_NEW}`)
      .set('Authorization', process.env.TOKEN_NEW)
      .send({ roles: ['businessOwner'] })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('ADMIN CAN NOT UPDATE ROLE BY ID TO ADMIN', (done) => {
    request(app)
      .patch(`/user/${process.env.ID_NEW}`)
      .set('Authorization', process.env.TOKEN_ADMIN)
      .send({ roles: ['admin'] })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });
});
