const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../index');

describe('SEARCH USER AS ADMIN', () => {
  it('should search users by name', (done) => {
    request(app)
      .post('/user/search')
      .send({ name: 'new new' })
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.items.length).eq(1);
        done();
      });
  });

  it('should search users by email', (done) => {
    request(app)
      .post('/user/search')
      .send({ email: 'new@new.com' })
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.items.length).eq(1);
        done();
      });
  });

  it('should search users by role', (done) => {
    request(app)
      .post('/user/search')
      .send({ role: 'new' })
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.items.length).eq(1);
        done();
      });
  });

  it('should search users with 2 data => name and email', (done) => {
    request(app)
      .post('/user/search')
      .send({
        name: 'new new',
        email: 'new@new.com',
      })
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.items.length).eq(1);
        done();
      });
  });

  it('should search users with 3 data => name, email and role', (done) => {
    request(app)
      .post('/user/search')
      .send({
        name: 'new new',
        email: 'new@new.com',
        role: 'new',
      })
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.items.length).eq(1);
        done();
      });
  });
});
