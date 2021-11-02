const { Router } = require('express');
const upload = require('../utils/multerFileUploader');
const userCheckAuth = require('./middlewares/userCheckAuth');
const { userCheckPerm } = require('../permission/userCheckPerm');
const userCheckEmailSendPerm = require('../permission/userCheckEmailSendPerm');
const userRegister = require('./controllers/userRegister');
const userLogin = require('./controllers/userLogin');
const userLogout = require('./controllers/userLogout');
const userPasswordResetRequest = require('./controllers/resetPassword/userPasswordResetRequest');
const userPasswordIsValidResetLink = require('./controllers/resetPassword/userValidResetLink');
const userPasswordResetNew = require('./controllers/resetPassword/userPasswordResetNew');
const userPasswordUpdate = require('./controllers/resetPassword/userPasswordUpdate');
const userGetById = require('./controllers/userGetById');
const userGetAuthUser = require('./controllers/userGetAuthUser');
const userDeleteById = require('./controllers/userDeleteById');
const userUpdateRoleById = require('./controllers/userUpdateRoleById');
const userUpdateSelf = require('./controllers/userUpdateSelf');
const userEmailConfirm = require('./controllers/mailConfirm/userEmailConfirm');
const userVerifyEmailSend = require('./controllers/mailConfirm/userVerifyEmailSend');
const userPhoneCodeCheck = require('./controllers/phoneConfirm/userPhoneCodeCheck');
const userPhoneCodeSend = require('./controllers/phoneConfirm/userPhoneCodeSend');
const serviceHeader = require('../utils/serviceHeader');
const getResetPasswordHash = require('./controllers/resetPassword/getResetPasswordHash');
const userDeleteByEmail = require('./controllers/userDeleteByEmail');
const userGetByEmail = require('./controllers/userGetByEmail');
const userSearch = require('./controllers/userSearch');
const userGetAllRoles = require('./controllers/userGetAllRoles');
const userImpersonate = require('./controllers/userImpersonate');
const userStats = require('./controllers/userStats');
const userSearchHelper = require('./helpers/userSearchHelper');
//const userPartOfMyTeacher = require('./middlewares/userPartOfMyCompany');
const userUploadAvatar = require('./controllers/userUploadAvatar');

const router = Router();

router.post('/', serviceHeader('userRegister'), userRegister); //   POST localhost:5000/user/

router.post('/login', serviceHeader('userLogin'), userLogin);

router.get('/logout', serviceHeader('userLogout'), userLogout);

router.get(
  '/auth',
  serviceHeader('userGetAuthUser'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  userGetAuthUser,
);

router.get(
  '/stats',
  serviceHeader('userStats'),
  userCheckAuth,
  userCheckPerm('user.stats'),
  userStats,
);

router.post(
  '/search/user',
  serviceHeader('userSearch'),
  userCheckAuth,
  userCheckPerm('user.get.all'),
  userSearchHelper,
);

router.post(
  '/impersonate',
  serviceHeader('userImpersonate'),
  userCheckAuth,
  userCheckPerm('user.impersonate'),
  userImpersonate,
);

router.get(
  '/roles',
  serviceHeader('userGetAllRoles'),
  userCheckAuth,
  userCheckPerm('user.search'),
  userGetAllRoles,
);

router.post(
  '/search',
  serviceHeader('userSearch'),
  userCheckAuth,
  userCheckPerm('user.search'),
  userSearch,
);
router.post(
  '/password/reset/request',
  serviceHeader('userPasswordResetRequest'),
  userPasswordResetRequest,
);
router.post(
  '/password/reset/valid',
  serviceHeader('userPasswordIsValidResetLink'),
  userPasswordIsValidResetLink,
);
router.post(
  '/password/reset/new',
  serviceHeader('userPasswordResetNew'),
  userPasswordResetNew,
);

router.post(
  '/password/update/',
  serviceHeader('userPasswordUpdate'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  userPasswordUpdate,
);

router.get(
  '/hash/:userId',
  serviceHeader('getResetPasswordHash'),
  userCheckAuth,
  userCheckPerm('user.update.any'),
  getResetPasswordHash,
);

router.get(
  '/email/:email',
  serviceHeader('userGetByEmail'),
  userCheckAuth,
  userCheckPerm('user.update.any'),
  userGetByEmail,
);

router.patch(
  '/',
  serviceHeader('userUpdateSelf'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  userUpdateSelf,
);

router.patch(
  '/:userId',
  serviceHeader('userUpdateRoleById'),
  userCheckAuth,
  userCheckPerm('user.update.any'),
  userUpdateRoleById,
);

router.delete(
  '/:userId',
  serviceHeader('userDeleteById'),
  userCheckAuth,
  userCheckPerm('user.delete.any'),
  userDeleteById,
);

router.delete(
  '/email/:email',
  serviceHeader('userDeleteByEmail'),
  userCheckAuth,
  userCheckPerm('user.delete.any'),
  userDeleteByEmail,
);

router.get(
  '/verify/email/:userId/:hash',
  serviceHeader('userEmailConfirm'),
  userEmailConfirm,
);

router.post(
  '/verify/email/send',
  serviceHeader('userVerifyEmailSend'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  userCheckEmailSendPerm,
  userVerifyEmailSend,
);

router.post(
  '/verify/phone/code/check',
  serviceHeader('userPhoneCodeCheck'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  userPhoneCodeCheck,
);

router.post(
  '/verify/phone/code/send',
  serviceHeader('userPhoneCodeSend'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  userPhoneCodeSend,
);

router.get(
  '/:userId',
  serviceHeader('userGetById'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  //  userPartOfMyCompany,
  userGetById,
);

router.put(
  '/:userId/avatar',
  upload.single('avatar'),
  serviceHeader('userUploadAvatar'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  userUploadAvatar,
);

module.exports = router;
