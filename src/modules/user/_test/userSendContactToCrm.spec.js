const User = require('../userModel');
const { invalidToken, user } = require('./data');
const { userCreate, userSendContactToCrm } = require('./requests');
const { expect } = require('chai');

describe('USER SEND CONTACT TO CRM POSITIVE', () => {
  let userId = null;
  before(() => {
    return User.deleteOne({ email: user.email });
  });

  after(() => {
    return User.deleteOne({ email: user.email });
  });

  it('User register request ', (done) => {
    userCreate(user)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        userId = res.body.payload.userId;
        done();
      });
  });

  it('User send contact to crm', (done) => {
    userSendContactToCrm(userId, process.env.TOKEN_ADMIN)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).equal(true);
        done();
      });
  });
});

describe('USER SEND CONTACT TO CRM NEGATIVE', () => {
  let userId = null;
  let vrongUserId = userId + '1';

  before(() => {
    return User.deleteOne({ email: user.email });
  });

  after(() => {
    return User.deleteOne({ email: user.email });
  });

  it('User register request ', (done) => {
    userCreate(user)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        userId = res.body.payload.userId;
        done();
      });
  });

  it('User send contact to crm with token businessOwner', (done) => {
    userSendContactToCrm(userId, process.env.TOKEN_BUSINESSOWNER)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).equal(false);
        done();
      });
  });

  it('User send contact to crm with token new', (done) => {
    userSendContactToCrm(userId, process.env.TOKEN_NEW)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).equal(false);
        done();
      });
  });

  it('User send contact to crm with invalid token', (done) => {
    userSendContactToCrm(userId, invalidToken)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).equal(false);
        done();
      });
  });

  it('User send contact to crm with wrong ID', (done) => {
    userSendContactToCrm(vrongUserId, process.env.TOKEN_ADMIN)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).equal(false);
        done();
      });
  });

  it('User send contact to crm with empty token', (done) => {
    userSendContactToCrm(userId, '')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).equal(false);
        done();
      });
  });
});
