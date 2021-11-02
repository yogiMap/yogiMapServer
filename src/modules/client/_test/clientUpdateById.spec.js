const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../index');

describe('CLIENT Updates', () => {
  it('Teacher can update client info by ID', function (done) {
    request(app)
      .patch(`/client/${process.env.ID_CLIENT}`)
      .set('Authorization', process.env.TOKEN_BUSINESSOWNER)
      .send({
        company: 'New company name2',
        email: 'newemail2@gmail.com',
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        expect(res.body.message).to.eq('Client updated');
        done();
      });
  });

  it('ADMIN can update client info by ID', function (done) {
    request(app)
      .patch(`/client/${process.env.ID_CLIENT}`)
      .set('Authorization', process.env.TOKEN_ADMIN)
      .send({
        company: 'New company name3',
        email: 'newemail3@gmail.com',
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        expect(res.body.message).to.eq('Client updated');
        done();
      });
  });

  it('NEW user can not update client info by ID', function (done) {
    request(app)
      .patch(`/client/${process.env.ID_CLIENT}`)
      .set('Authorization', process.env.TOKEN_NEW)
      .send({
        company: 'New company name2',
        email: 'new.email@gmail.com',
      })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });
});
