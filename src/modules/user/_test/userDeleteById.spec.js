const { user, invalidToken } = require('./data');
const { expect } = require('chai');
const { userCreate, userDeleteById } = require('./requests');

describe('USER DELETE BY ID', () => {
  let userTestId = null;
  it('Register new user', (done) => {
    userCreate(user)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        userTestId = res.body.payload['userId'];
        done();
      });
  });

  it('User with role New can not delete user by Id', (done) => {
    userDeleteById(userTestId, process.env.TOKEN_NEW)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('User with role Business Owner can not delete user by Id', (done) => {
    userDeleteById(userTestId, process.env.TOKEN_BUSINESSOWNER)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('Token required to delete user by Id', (done) => {
    userDeleteById(userTestId)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('User with invalid token is not allowed to delete user by Id', (done) => {
    userDeleteById(userTestId, invalidToken)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('User with role Admin can delete user by Id', (done) => {
    userDeleteById(userTestId, process.env.TOKEN_ADMIN)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });
});
