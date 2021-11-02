const { expect } = require('chai');
const { sipPhoneCreate } = require('./requests');

const sipPhone = {
  name: 'SipPhone 1',
  description: 'Some sipPhone 1 description',
};

describe('SipPhone CREATE', () => {
  it('Should create SipPhone with role ADMIN', (done) => {
    sipPhoneCreate(sipPhone, process.env.TOKEN_ADMIN)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });
});

describe('SipPhone CREATE. NEGATIVE', () => {
  it('Should not create SipPhone with role NEW', (done) => {
    sipPhoneCreate(sipPhone, process.env.TOKEN_NEW)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.fail).true;
        done();
      });
  });

  it('Should not create SipPhone with role BUSINESSOWNER', (done) => {
    sipPhoneCreate(sipPhone, process.env.TOKEN_BUSINESSOWNER)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.fail).true;
        done();
      });
  });
});
