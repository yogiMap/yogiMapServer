const { expect } = require('chai');
const { baseCreate } = require('./requests');

const base = {
  name: 'Base 1',
  description: 'Some base 1 description',
};

describe('BASE CREATE', () => {
  it('Should create Base with role ADMIN', (done) => {
    baseCreate(base, process.env.TOKEN_ADMIN)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });
});

describe('BASE CREATE. NEGATIVE', () => {
  it('Should not create Base with role NEW', (done) => {
    baseCreate(base, process.env.TOKEN_NEW)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.fail).true;
        done();
      });
  });

  it('Should not create Base with role BUSINESSOWNER', (done) => {
    baseCreate(base, process.env.TOKEN_BUSINESSOWNER)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.fail).true;
        done();
      });
  });
});
