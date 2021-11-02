const request = require('supertest');
const app = require('../../../index');
const { expect } = require('chai');

process.env.HASH_NEW = null;

describe('Getting Hash', () => {
  it('Getting Hash', (done) => {
    console.log(process.env.ID_NEW, process.env.TOKEN_ADMIN);
    request(app)
      .get(`/user/hash/${process.env.ID_NEW}`)
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        console.log(res.body.payload);
        process.env.HASH_NEW = res.body.payload.hash;
        console.log('=========HASH_NEW====================');
        console.log(process.env.HASH_NEW);
        expect(res.body.success).true;
        expect(res.body.message).to.eq('User get hash. Success');
        done();
      });
  });
});
