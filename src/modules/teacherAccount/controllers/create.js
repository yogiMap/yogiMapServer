const mongoose = require('mongoose');
const message = require('../../utils/messages');
const analytics = require('../../analytics/controllers/analytics');
const { get } = require('lodash');
const createTeacherAccountQuery = require('../queries/create');
const userUpdateByIdQuery = require('../../user/queries/updateById');
const getNextAccountCodeQuery = require('../queries/getNextAccountCodeQuery');
const countTeachers = require('../queries/countTeachers');
const addTeacherRole = require('../queries/addTeacherRole');
//const { nanoid } = require('nanoid');

const generateId = () => new mongoose.Types.ObjectId();

module.exports = async function teacherAccountCreate(req, res) {
  // Читаем данные из запроса
  const code = await getNextAccountCodeQuery();
  const _id = generateId();
  const userId = get(req, 'user._id', '');
  const name = get(req, 'body.name');
  const email = get(req, 'body.email');
  const phoneNumber = get(req, 'body.phoneNumber', {});
  const address = get(req, 'body.address');
  const addressLine1 = get(req, 'body.addressLine1');
  const addressLine2 = get(req, 'body.addressLine2');
  const city = get(req, 'body.city');
  const state = get(req, 'body.state');
  const country = get(req, 'body.country', 'United States');
  const zipCode = get(req, 'body.zipCode');
  const timeZone = get(req, 'body.timeZone');
  const image = get(req, 'body.image', []);
  const description = get(req, 'body.description');
  const style = get(req, 'body.style');
  const classType = get(req, 'body.classType');
  const focus = get(req, 'body.focus');
  const classes = get(req, 'body.classes');
  const event = get(req, 'body.event');
  const isTeacher = get(req, 'body.isTeacher');
  const coords = get(req, 'body.coords');
  // const inviteHash = new mongoose.Types.ObjectId();

  // check if current user has an Teacher Account
  const countTeachersResult = await countTeachers(userId);
  if (countTeachersResult.success) {
    if (countTeachersResult.payload >= 1) {
      return res
        .status(400)
        .json(message.fail('Teacher Account exists. Only one Teacher per owner'));
    }
  } else {
    return res.status(400).json(message.fail('Teacher Account. Check count error'));
  }

  const createTeacherAccountQueryResult = await createTeacherAccountQuery({
    _id,
    // inviteHash: nanoid(),
    code,
    name,
    phoneNumber,
    email,
    address,
    addressLine1,
    addressLine2,
    city,
    state,
    country,
    zipCode,
    timeZone,
    description,
    style,
    classType,
    focus,
    classes,
    event,
    image,
    isTeacher,
    owner: userId,
    coords,
  });

  const userUpdateByTeacherAccountId = await userUpdateByIdQuery({
    userId,
    values: { teacherAccount: _id },
  });

  const changeRoleToTeacherResult = await addTeacherRole(userId);

  if (
    createTeacherAccountQueryResult.success &&
    userUpdateByTeacherAccountId.success &&
    changeRoleToTeacherResult.success
  ) {
    return res.status(200).json(createTeacherAccountQueryResult);
  } else {
    const analyticsId = analytics('TEACHER_ACCOUNT_CREATE_ERROR', {
      error: createTeacherAccountQueryResult.payload,
      body: req.body,
      entity: 'TeacherAccount',
      entityId: _id,
      user: userId,
      controller: 'teacherAccountCreate',
    });

    return res.status(400).json(message.fail('TeacherAccount create error', analyticsId));
  }
};
