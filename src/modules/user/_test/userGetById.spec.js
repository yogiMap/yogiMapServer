const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../index');
const { invalidToken, notExistUserID, userFromOtherCompany } = require('./data');
const { userCreate, createCompanyAccountForUser, loginUser } = require('./requests');

let userRoles = ['NEW', 'ADMIN', 'BUSINESSOWNER'];
let userFromOtherCompanyToken = null;

describe('GET USER BY ID', () => {
  for (const role of userRoles) {
    it(`Get itself by id as ${role}`, (done) => {
      request(app)
        .get(`/user/${process.env[`ID_${role.toUpperCase()}`]}`)
        .set('Authorization', process.env[`TOKEN_${role.toUpperCase()}`])
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).true;
          expect(res.body.message).not.empty;
          done();
        });
    });
  }

  it('Get user by id as ADMIN', (done) => {
    request(app)
      .get(`/user/${process.env.ID_BUSINESSOWNER}`)
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        expect(res.body.message).not.empty;
        done();
      });
  });

  it('Get user by id as BUSINESSOWNER', (done) => {
    request(app)
      .get(`/user/${process.env.ID_BUSINESSOWNER}`)
      .set('Authorization', process.env.TOKEN_BUSINESSOWNER)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        expect(res.body.message).not.empty;
        done();
      });
  });
});

describe('GET USER BY ID. NEGATIVE TESTS', () => {
  it('Should not get user by id as NEW', (done) => {
    request(app)
      .get(`/user/${process.env.ID_BUSINESSOWNER}`)
      .set('Authorization', process.env.TOKEN_NEW)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).not.empty;
        expect(res.body.success).false;
        done();
      });
  });

  it('Should not get user by id with empty token', (done) => {
    request(app)
      .get(`/user/${process.env.ID_NEW}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).not.empty;
        expect(res.body.success).false;
        done();
      });
  });

  it('Should not get user by id with invalid token', (done) => {
    request(app)
      .get(`/user/${process.env.ID_BUSINESSOWNER}`)
      .set('Authorization', invalidToken)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).not.empty;
        expect(res.body.success).false;
        done();
      });
  });

  it('Should not get user by id for non exist user', (done) => {
    request(app)
      .get(`/user/${notExistUserID}`)
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).not.empty;
        expect(res.body.success).false;
        done();
      });
  });
  describe('Should not get user by id for user from other company'.toUpperCase(), () => {
    it('Register user', (done) => {
      userCreate(userFromOtherCompany).end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
    });

    it('Login', (done) => {
      loginUser(userFromOtherCompany).end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        userFromOtherCompanyToken = res.body.payload.token;
        done();
      });
    });
    it('Create companyAccount', (done) => {
      createCompanyAccountForUser(userFromOtherCompanyToken).end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
    });
    it('User get by id from other company', (done) => {
      request(app)
        .get(`/user/${process.env.ID_BUSINESSOWNER}`)
        .set('Authorization', userFromOtherCompanyToken)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).not.empty;
          expect(res.body.success).false;
          done();
        });
    });
  });
});
