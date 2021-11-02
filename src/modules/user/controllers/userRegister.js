const mongoose = require('mongoose');
const User = require('../userModel');
const message = require('../../utils/messages');
const sendMailCreatedUser = require('../helpers/sendMailCreatedUser');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const { isValidEmail, checkPassword } = require('../../utils/validators');
const hashPassword = require('../helpers/hashPassword');
const checkIfUserExists = require('../queries/checkIfUserExists');
const { nanoid } = require('nanoid');

const userRegister = async (req, res) => {
  const firstName = get(req, 'body.firstName', '').trim();
  const lastName = get(req, 'body.lastName', '').trim();
  let fullName = firstName + " " + lastName;

  const email = get(req, 'body.email', '').trim();
  const password = get(req, 'body.password', '');

  const teacherAccountId = get(req, 'body.teacherAccountId', null);
  const isTeacher = !teacherAccountId;
  const roles = ['verified'];

  if (!checkPassword(password)) {
    const reason = 'Wrong password format';
    analytics('USER_REGISTER_FAIL', {
      reason: reason,
      email,
      firstName,
      lastName,
    });
    return res.status(400).json(message.fail(reason));
  }

  if (!isValidEmail(email)) {
    return res.status(400).json(message.fail('Incorrect email format'));
  }

  const isUserExists = await checkIfUserExists(email);

  if (isUserExists) {
    const analyticsId = analytics('USER_REGISTER_FAIL', {
      reason: 'Email already registered',
      email,
      firstName,
      lastName,
      roles,
    });
    return res.status(409).json(message.fail('Email is already registered', analyticsId));
  }

  const userId = new mongoose.Types.ObjectId();

  const createdUser = await createUser({
    userId,
    email,
    password,
    firstName,
    lastName,
    teacherAccount: teacherAccountId,
    isTeacher,
    roles,
  });

  if (createdUser.success) {
    analytics('USER_REGISTER_SUCCESS', {
      email,
      firstName,
      lastName,
    });

    return res.status(201).json(
      message.success(
        'User successfully created. Please check your email and verify it',
        {
          userId,
        },
      ),
    );
  } else {
    const analyticsId = analytics('USER_REGISTER_FAIL', {
      reason: get(createdUser, 'payload.message'),
      email,
      firstName,
      lastName,
    });
    return res.status(400).json(message.fail('User register error', analyticsId));
  }
};

module.exports = userRegister;

async function createUser({
  userId,
  email,
  password,
  firstName,
  lastName,
  teacherAccount,
  isTeacher,
  roles,
}) {
  const emailHashConfirmation = nanoid();

  const user = new User({
    _id: userId,
    email,
    emailConfirmation: {
      hash: emailHashConfirmation,
      confirmed: false,
    },
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    password: hashPassword(password),
    timeZone: 'America/Los_Angeles',
    teacherAccount,
    isTeacher,
    roles,
  });

  return user
    .save()
    .then(() => {
      sendMailCreatedUser({
        email,
        emailHashConfirmation,
        firstName,
        lastName,
        userId,
      }).catch((error) => {
        //
        analytics('USER_REGISTER_ERROR', {
          email,
          firstName,
          lastName,
        });

        throw new Error(error);
      });
      return message.success('User created successfully', userId, false);
    })
    .catch((error) => {
      return message.fail('Error', error);
    });
}
