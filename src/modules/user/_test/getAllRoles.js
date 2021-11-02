const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../index');

describe('USER GET ALL ROLES', () => {
  it('Getting All Roles', (done) => {
    request(app)
      .get('/user/roles')
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        console.log('=========ALL_ROLES====================');
        expect(res.body.success).true;
        done();
      });
  });
});
