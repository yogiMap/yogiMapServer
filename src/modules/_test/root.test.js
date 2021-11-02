const request = require('supertest');
const app = require('../../index');
const { users, teacherAccount } = require('./data');
const { options, connectionString } = require('../core/db');
const User = require('../user/userModel');
const mongoose = require('mongoose');
const userShape = require('./userShape');
const TeacherAccount = require('../teacherAccount/Model');
const { loginUser } = require('./helpers');

let connection;
process.env.TOKEN_NEW = null;
process.env.TOKEN_ADMIN = null;
process.env.TOKEN_BUSINESSOWNER = null;
process.env.ID_ADMIN = null;
process.env.ID_NEW = null;
process.env.ID_BUSINESSOWNER = null;
process.env.ID_EMPLOYEE = null;
process.env.ID_TEACHERACCOUNT_BUSINESSOWNER = null;
process.env.ID_TEACHERACCOUNT_ADMIN = null;

describe('USER COLLECTION DROP', () => {
  it('should delete all users', () => {
    return User.deleteMany({});
  });
  it('should delete all teacherAccounts', () => {
    return TeacherAccount.deleteMany({});
  });
});

describe('USER CREATE PREDEFINED', () => {
  it('should create users', () => {
    mongoose.connect(connectionString, options).catch((err) => console.log(err));
    connection = mongoose.connection;
    connection
      .collection('users')
      .insertMany([userShape('new'), userShape('businessOwner'),
        userShape('admin'), userShape('employee')])
      .catch((err) => {
        console.log(err);
        return err;
      });
  });
});

describe('GET ALL USER TOKENS and ID', () => {
  for (const role in users) {
    it(`Login as ${role}`, (done) => {
      loginUser(users[role]).end((err, res) => {
        if (err) return done(err);
        process.env[`TOKEN_${role.toUpperCase()}`] = res.body.payload.token;
        process.env[`ID_${role.toUpperCase()}`] = res.body.payload.user._id;
        console.log(`=========TOKEN_${role}====================`);
        console.log(process.env[`TOKEN_${role.toUpperCase()}`]);
        console.log(`=========ID_${role}===================`);
        console.log(process.env[`ID_${role.toUpperCase()}`]);
        done();
      });
    });
  }
});

describe('CREATE TEACHER ACCOUNT FOR BusinessOwner', () => {
  it('should create teacher account for BusinessOwner', (done) => {
    request(app)
      .post('/teacherAccount/')
      .set('Authorization', process.env.TOKEN_BUSINESSOWNER)
      .send(teacherAccount)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it('should get companyAccountId for BusinessOwner', (done) => {
    loginUser(users.businessOwner).end((err, res) => {
      if (err) return done(err);
      process.env.ID_COMPANYACCOUNT_BUSINESSOWNER = res.body.payload.user.companyAccount;
      console.log('=========ID_COMPANYACCOUNT_BUSINESSOWNER===================');
      console.log(process.env.ID_COMPANYACCOUNT_BUSINESSOWNER);
      done();
    });
  });
});

describe('CREATE COMPANY ACCOUNT FOR ADMIN', () => {
  it('should create company account for BusinessOwner', (done) => {
    request(app)
      .post('/companyAccount/')
      .set('Authorization', process.env.TOKEN_ADMIN)
      .send(companyAccount)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it('should get companyAccountId for Admin', (done) => {
    loginUser(users.admin).end((err, res) => {
      if (err) return done(err);
      process.env.ID_COMPANYACCOUNT_ADMIN = res.body.payload.user.companyAccount;
      console.log('=========ID_COMPANYACCOUNT_ADMIN===================');
      console.log(process.env.ID_COMPANYACCOUNT_ADMIN);
      done();
    });
  });
});

describe('ASSIGN COMPANY ACCOUNT FOR EMPLOYEE', () => {
  it('should assign company account for Employee', () => {
    return User.findOneAndUpdate(
      { _id: process.env.ID_EMPLOYEE },
      { $set: { companyAccount: process.env.ID_COMPANYACCOUNT_BUSINESSOWNER, isCompanyOwner: false } },
      { runValidators: true },
    ).exec();
  });
});
