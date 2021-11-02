const { Router } = require('express');
const serviceHeader = require('../utils/serviceHeader');
const { userCheckPerm } = require('../permission/userCheckPerm');
const teacherAccountCreate = require('./controllers/create');
const userCheckAuth = require('../user/middlewares/userCheckAuth');
const teacherAccountGetById = require('./controllers/getById');
const teacherAccountSearch = require('./controllers/search');
const teacherAccountUpdateById = require('./controllers/updateById');
const teacherAccountDeleteById = require('./controllers/deleteById');
const teacherAccountStats = require('./controllers/stats');
const pauseController = require('../core/pauseController');
const teacherAccountGetAll = require('./controllers/getAll');
const teacherGetSipPhone = require('./controllers/getSipPhone');
const teacherAccountUploadImage = require('./controllers/teacherAccountUploadImage');
const upload = require('../utils/multerFileUploader');

const router = Router();

router.get(
  '/stats',
  serviceHeader('teacherAccountStats'),
  // userCheckAuth,
  // userCheckPerm('teacherAccount.search.own'),
  // pauseController,
  teacherAccountStats,
);

router.post(
  '/',
  serviceHeader('teacherAccountCreate'),
  userCheckAuth,
  userCheckPerm('teacherAccount.create.own'),
  pauseController,
  teacherAccountCreate,
);

router.get(
  '/:teacherAccountId',
  serviceHeader('teacherAccountGetById'),
  userCheckAuth,
  userCheckPerm('teacherAccount.get.own'),
  pauseController,
  teacherAccountGetById,
);

router.get(
  '/:teacherAccountId/sipPhone',
  serviceHeader('teacherAccountGetSipPhone'),
  userCheckAuth,
  userCheckPerm('teacherAccount.get.own'),
  pauseController,
  teacherGetSipPhone,
);

router.post(
  '/search',
  serviceHeader('teacherAccountSearch'),
  // userCheckAuth,
  // userCheckPerm('teacherAccount.search.own'),
  // pauseController,
  teacherAccountSearch,
);

router.patch(
  '/:teacherAccountId',
  serviceHeader('teacherAccountUpdateById'),
  userCheckAuth,
  userCheckPerm('teacherAccount.update.own'),
  pauseController,
  teacherAccountUpdateById,
);

router.delete(
  '/:teacherAccountId',
  serviceHeader('teacherAccountDeleteById'),
  userCheckAuth,
  userCheckPerm('teacherAccount.delete.any'),
  pauseController,
  teacherAccountDeleteById,
);

router.get(
  '/',
  serviceHeader('teacherAccountGetAll'),
  // userCheckAuth,
  // userCheckPerm('teacherAccount.get.all'),
  // pauseController,
  teacherAccountGetAll,
);

router.put(
  '/:teacherAccountId/image',
  upload.single('image'),
  serviceHeader('teacherAccountUploadImage'),
  userCheckAuth,
  userCheckPerm('teacherAccount.update.own'),
  teacherAccountUploadImage,
);

module.exports = router;
