const { expect } = require('chai');
const { user } = require('./data');
const User = require('../userModel');
const { loginUser, userCreate, userGetByEmail } = require('./requests');
const app = require('../../../index');
const request = require('supertest');

describe('USER REGISTER, POSITIVE', () => {
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
        done();
      });
  });

  it('Verify registered user has role new', (done) => {
    loginUser(user)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        expect(res.body.payload.user.roles).deep.eq(['new']);
        done();
      });
  });

  it('Verify as admin registered user has role new and correct name', (done) => {
    userGetByEmail(user, process.env.TOKEN_ADMIN)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        expect(res.body.payload.firstName).eq(user.firstName);
        expect(res.body.payload.lastName).eq(user.lastName);
        expect(res.body.payload.roles).deep.eq(['new']);
        done();
      });
  });
});
describe('USER REGISTER, NEGATIVE', () => {
  before(() => {
    return User.deleteOne({ email: user.email });
  });

  after(() => {
    return User.deleteOne({ email: user.email });
  });

  it('Cannot register user without user body', (done) => {
    userCreate()
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('Using "get" request instead of "post" /user/login (for create user)', (done) => {
    request(app)
      .get('/user/login')
      .send(user)
      .set('Authorization', process.env.TOKEN_BUSINESSOWNER)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('Cannot register user only with email', (done) => {
    userCreate(user.email)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('Cannot register user with wrong email', (done) => {
    userCreate({ email: '!#$%@!$%.com', password: '123123' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('Cannot register user with wrong email(chinese letters)', (done) => {
    userCreate({ email: '诶诶@诶诶.com', password: '123123' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('Cannot register user with wrong email and empty password', (done) => {
    userCreate({ email: '!#$%@!$%.com', password: '       ' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  describe('USER REGISTER, NEGATIVE', () => {
    before((done) => {
      userCreate(user).end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
    });

    after(() => {
      return User.deleteOne({ email: user.email });
    });

    it('Cannot create user with the same email', function (done) {
      userCreate(user)
        .expect(409)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).false;
          done();
        });
    });
  });
});
