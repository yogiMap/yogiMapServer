const request = require('supertest');
const app = require('../../../index');

function userCreate(users) {
  return request(app).post('/user').send(users);
}

function userDeleteByEmail(users, cookie = []) {
  if (Array.isArray(cookie) && !cookie.length)
    return request(app).delete(`/user/email/${users.email}`);
  else {
    return request(app).delete(`/user/email/${users.email}`).set('Cookie', cookie);
  }
}

function userGetByEmail(users, cookie = []) {
  if (Array.isArray(cookie) && !cookie.length)
    return request(app).get(`/user/email/${users.email}`);
  else {
    return request(app).get(`/user/email/${users.email}`).set('Cookie', cookie);
  }
}

function userDeleteById(userId, cookie = []) {
  if (Array.isArray(cookie) && !cookie.length)
    return request(app).delete(`/user/${userId}`);
  else {
    return request(app).delete(`/user/${userId}`).set('Cookie', cookie);
  }
}

function createCompanyAccountForUser(cookie) {
  return request(app).post('/companyAccount/').set('Cookie', cookie).send({
    companyName: 'Fake LLC',
    email: 'userFromOtherCompany@new.com',
    phoneNumber1_code: '1',
    phoneNumber1_ext: '',
    phoneNumber1_number: '7897897878',
  });
}

function loginUser(user) {
  return request(app).post('/user/login').send(user);
}

function userSendContactToCrm(userId, cookie) {
  if (Array.isArray(cookie) && !cookie.length)
    return request(app).post(`/user/${userId}/crm`);
  else {
    return request(app).post(`/user/${userId}/crm`).set('Cookie', cookie);
  }
}

module.exports = {
  userCreate,
  userDeleteByEmail,
  userGetByEmail,
  userDeleteById,
  createCompanyAccountForUser,
  loginUser,
  userSendContactToCrm,
};
