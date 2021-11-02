const mongoose = require('mongoose');

const userShape = (role, userId, companyAccountId) => ({
  _id: userId || new mongoose.Types.ObjectId(),
  emailConfirmation: {
    confirmed: true,
    hash: '5df552d8aee9a784eb6a2d3a',
  },

  resetPassword: {
    history: [],
  },

  name: `${role} ${role}`,
  firstName: `${role}`,
  lastName: `${role}`,

  isCompanyOwner: true,
  timeZone: 'America/Los_Angeles',
  roles: [role],
  active: true,
  lastLogin: new Date(0),
  email: `${role}@${role}.com`.toLowerCase(),
  phone: '17775551122',
  password: '$2a$10$P0nOOU1/FGjCwaY.NbiQDOg/kqUzFRMWyhRRXQYCXJ50IZ/UMfPTa', // 123123
  createdAt: new Date(),
  updatedAt: new Date(),
  companyAccount: companyAccountId,
});

module.exports = userShape;
