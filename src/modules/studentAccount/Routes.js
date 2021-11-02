const { Router } = require('express');
const serviceHeader = require('../utils/serviceHeader');
const { userCheckPerm } = require('../permission/userCheckPerm');
const studentAccountCreate = require('./controllers/create');
const userCheckAuth = require('../user/middlewares/userCheckAuth');
const studentAccountGetById = require('./controllers/getById');
const studentAccountSearch = require('./controllers/search');
const studentAccountUpdateById = require('./controllers/updateById');
const studentAccountDeleteById = require('./controllers/deleteById');
const studentAccountStats = require('./controllers/stats');
const pauseController = require('../core/pauseController');

const router = Router();

// CRUD

router.get(
  '/stats', // GET /localhost:5000/studentAccountAccount/stats
  serviceHeader('studentAccountStats'), // mark request
  userCheckAuth, // midlware  needed to check if user has rights to do the request
  userCheckPerm('studentAccount.search.own'), // midlware has rights to do this operation such as studentAccount.search.own
  pauseController,
  studentAccountStats,
);

router.post(
  '/', // POST /localhost:5000/studentAccountAccount/stats
  serviceHeader('studentAccountCreate'),
  userCheckAuth,
  userCheckPerm('studentAccount.create.own'),
  // pauseController,
  studentAccountCreate,
);

router.get(
  '/:studentAccountId',
  serviceHeader('studentAccountGetById'),
  userCheckAuth,
  userCheckPerm('studentAccount.get.own'),
  pauseController,
  studentAccountGetById,
);

router.post(
  '/search',
  serviceHeader('studentAccountSearch'),
  userCheckAuth,
  userCheckPerm('studentAccount.search.own'),
  pauseController,
  studentAccountSearch,
);

router.patch(
  '/:studentAccountId',
  serviceHeader('studentAccountUpdateById'),
  userCheckAuth,
  userCheckPerm('studentAccount.update.own'),
  pauseController,
  studentAccountUpdateById,
);

router.delete(
  '/:studentAccountId',
  serviceHeader('studentAccountDeleteById'),
  userCheckAuth,
  userCheckPerm('studentAccount.delete.own'),
  pauseController,
  studentAccountDeleteById,
);

module.exports = router;
