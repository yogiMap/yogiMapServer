const permissions = require('../permission/roles');
const request = require('supertest');
const app = require('../../index');

const roleHasPermission = (role, action) => permissions[role].includes(action);
const token = (role) => process.env[`TOKEN_${role.toUpperCase()}`];
const loginUser = (user) => request(app).post('/user/login').send(user);

module.exports = { roleHasPermission, token, loginUser };
