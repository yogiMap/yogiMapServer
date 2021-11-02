const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../index');

describe('GET RESET PASSWORD HASH', () => {
  it('Admin is able to check if user can get hash for password reset by existing user id', (done) => {
    request(app)
      .get(`/user/hash/${process.env.ID_ADMIN}`)
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });

  it('BusinessOwner is unable to check if user can get hash for password reset by existing user id - 400 permission denied', (done) => {
    request(app)
      .get(`/user/hash/${process.env.ID_ADMIN}`)
      .set('Authorization', process.env.TOKEN_BUSINESSOWNER)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('NewUser is unable to check if user can get hash for password reset by existing user id - 400 permission denied', (done) => {
    request(app)
      .get(`/user/hash/${process.env.ID_ADMIN}`)
      .set('Authorization', process.env.TOKEN_NEW)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('Unauthorized user is unable to check if user can get hash for password reset by existing user id - 400 Auth failed', (done) => {
    request(app)
      .get(`/user/hash/${process.env.ID_ADMIN}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('Admin is unable to check if user can get hash for password reset by non-existing user id - 400 Current user not found', (done) => {
    request(app)
      .get(`/user/hash/1${process.env.ID_ADMIN}`)
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('BusinessOwner is unable to check if user can get hash for password reset by non-existing user id - 400 permission denied', (done) => {
    request(app)
      .get(`/user/hash/1${process.env.ID_ADMIN}`)
      .set('Authorization', process.env.TOKEN_BUSINESSOWNER)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('NewUser is unable to check if user can get hash for password reset by non-existing user id - 400 permission denied', (done) => {
    request(app)
      .get(`/user/hash/1${process.env.ID_ADMIN}`)
      .set('Authorization', process.env.TOKEN_NEW)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('Unauthorized user is unable to check if user can get hash for password reset by non-existing user id - 400 Auth failed', (done) => {
    request(app)
      .get(`/user/hash/1${process.env.ID_ADMIN}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('Admin is unable to check if user can get hash for password reset without indicating user id - 400 User get by ID. Error', (done) => {
    request(app)
      .get('/user/hash/')
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('BusinessOwner is unable to check if user can get hash for password reset without indicating user id - 400 User get by ID. Error', (done) => {
    request(app)
      .get('/user/hash/')
      .set('Authorization', process.env.TOKEN_BUSINESSOWNER)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('NewUser is unable to check if user can get hash for password reset without indicating user id - 400 User get by ID. Error', (done) => {
    request(app)
      .get('/user/hash/')
      .set('Authorization', process.env.TOKEN_NEW)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('Unauthorized user is unable to check if user can get hash for password reset without indicating user id - 400 Auth failed', (done) => {
    request(app)
      .get('/user/hash/')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });
});
