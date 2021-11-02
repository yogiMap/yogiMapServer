// const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../index');
// const users = require('../../_test/data');

process.env.HASH_NEW = null;
process.env.HASH_BUSINESSOWNER = null;
process.env.HASH_ADMIN = null;

// async function gettingHash() {
//   process.env.HASH_NEW = (
//     await request(app)
//       .get(`/user/hash/${process.env.ID_NEW}`)
//       .set('Authorization', process.env.TOKEN_ADMIN)
//   ).body.payload.hash;
//   // .then((res) => {
//   //  .end((err, res) => {
//   //  if (err) return err;
//   //  = res.body.payload.hash;
//    console.log('=========HASH_NEW====================');
//   console.log(process.env.HASH_NEW);
//   //  return process.env.HASH_NEW;
//   //});
// }

async function gettingHash() {
  await request(app)
    .get(`/user/hash/${process.env.ID_NEW}`)
    .set('Authorization', process.env.TOKEN_ADMIN)
    .end((err, res) => {
      if (err) return err;
      res = res.body.payload.hash;
      //process.env.HASH_NEW = res.body.payload.hash;
      console.log('=========HASH_NEW====================');
      console.log(res);
      return res;
      // console.log(process.env.HASH_NEW);
    });
}

module.exports = gettingHash;
