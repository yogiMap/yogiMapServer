const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../index');
const { client, invalidToken } = require('./data');
const Client = require('../Model');

describe('CLIENT REGISTER', () => {
  after(() => {
    return Client.deleteOne({ email: client.email });
  });

  it('should create Client as Teacher', (done) => {
    request(app)
      .post('/client')
      .set('Authorization', process.env.TOKEN_TEACHER)
      .send(client)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });

  it('should create Client as Admin', (done) => {
    request(app)
      .post('/client')
      .set('Authorization', process.env.TOKEN_ADMIN)
      .send(client)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });

  it('should not create Client as New user', (done) => {
    request(app)
      .post('/client')
      .set('Authorization', process.env.TOKEN_NEW)
      .send(client)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should not create Client without Token', (done) => {
    request(app)
      .post('/client')
      .send(client)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should not create Client with invalid Token', (done) => {
    request(app)
      .post('/client')
      .send(client)
      .set('Authorization', invalidToken)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should create Client as Admin', (done) => {
    request(app)
      .post('/client')
      .set('Authorization', process.env.TOKEN_ADMIN)
      .send(client)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });

  it('should not create Client as New user', (done) => {
    request(app)
      .post('/client')
      .set('Authorization', process.env.TOKEN_NEW)
      .send(client)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should not create Client without Token', (done) => {
    request(app)
      .post('/client')
      .send(client)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should not create Client with invalid Token', (done) => {
    request(app)
      .post('/client')
      .send(client)
      .set('Authorization', invalidToken)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });
});
