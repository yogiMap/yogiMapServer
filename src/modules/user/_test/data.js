const user = {
  email: 'new2@new2.com',
  password: '1!qQ231',
  firstName: 'NewTwo',
  lastName: 'LastNameNewTwo',
  phone: '123456789',
};

const notExistUserID = '78a471c6fc11121f11b70123';

const invalidToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbgFpbCI6ImFkbWluQHRlc3QudGVzdCIsInVzZXJJZCI6IjVlMWNjNmM0MjZjY2I0NWE4MWE4NTQ1YiIsImNvZGV3YXJzSWQiOm51bGwsImlhdCI6MTU3ODk0NDI0MiwiZXhwIjoxNTc5ODA4MjQyfQ.qYCD6TgcGT5K1DSkIsSNAhDWr9qqJR9PVKUu_bLtAGA';

const permissionsRole = {
  new: [],
  businessOwner: ['user.get.by.id'],
  admin: ['user.get.by.id'],
};

const userFromOtherCompany = {
  email: 'userFromOtherCompany@new.com',
  password: '123123qQ!',
  firstName: 'UserFromOtherCompany',
  lastName: 'UserFromOtherCompany',
  phone: '123456789',
};

module.exports = {
  user,
  notExistUserID,
  invalidToken,
  permissionsRole,
  userFromOtherCompany,
};
