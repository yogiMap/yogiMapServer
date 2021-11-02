const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../index');

const expireToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInVzZXJJZCI6IjYwYjU0Mjc2ZTYzYTZjMThjYmExMDFjZiIsImlhdCI6MTYyMjQ5MTc2NiwiZXhwIjoxNjIzMzU1NzY2fQ.84tOzO9yJeGwB6-iPwOVMKdt8FHlpmTIi-7f95iwzMQ';

describe('SEARCH USER AS ADMIN, INCORRECT DATA', () => {
  it('shouldn`t search user without token', (done) => {
    request(app)
      .post('/user/search')
      .send({ name: 'new new' })
      .expect(400)
      .end((err, res) => {
        expect(res.body.success).false;
        done();
      });
  });

  it('shouldn`t search without expire token', (done) => {
    request(app)
      .post('/user/search')
      .send({ name: 'new new' })
      .set('Authorization', expireToken)
      .expect(400)
      .end((err, res) => {
        expect(res.body.success).false;
        done();
      });
  });
});
