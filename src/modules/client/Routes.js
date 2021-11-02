const { Router } = require('express');
const serviceHeader = require('../utils/serviceHeader');
const { userCheckPerm } = require('../permission/userCheckPerm');

const clientCreate = require('./controllers/create');
const userCheckAuth = require('../user/middlewares/userCheckAuth');
const clientGetById = require('./controllers/getById');
const clientSearch = require('./controllers/search');
const clientUpdateById = require('./controllers/updateById');
const clientDeleteById = require('./controllers/deleteById');
const clientStats = require('./controllers/stats');
const pauseController = require('../core/pauseController');
const clientGetInfoById = require('./controllers/getInfoById');
const clientPartOfMyCompany = require('./middlewares/clientPartOfMyCompany');
const userHasTeacherAccount = require('../permission/userHasTeacherAccount');

const router = Router();

router.get(
  '/stats',
  serviceHeader('clientStats'),
  userCheckAuth,
  userCheckPerm('client.search.own'),
  pauseController,
  userHasTeacherAccount,
  clientStats,
);

router.post(
  '/',
  serviceHeader('clientCreate'),
  userCheckAuth,
  userCheckPerm('client.create.own'),
  pauseController,
  clientCreate,
);

router.get(
  '/:clientId',
  serviceHeader('clientGetById'),
  userCheckAuth,
  userCheckPerm('client.get.own'),
  pauseController,
  clientPartOfMyCompany,
  clientGetById,
);

router.get(
  '/info/:clientId',
  serviceHeader('clientGetInfoById'),
  userCheckAuth,
  userCheckPerm('client.get.own'),
  pauseController,
  clientPartOfMyCompany,
  clientGetInfoById,
);

router.post(
  '/search',
  serviceHeader('clientSearch'),
  userCheckAuth,
  userCheckPerm('client.search.own'),
  pauseController,
  clientSearch,
);

router.patch(
  '/:clientId',
  serviceHeader('clientUpdateById'),
  userCheckAuth,
  userCheckPerm('client.update.own'),
  pauseController,
  clientPartOfMyCompany,
  clientUpdateById,
);

router.delete(
  '/:clientId',
  serviceHeader('clientDeleteById'),
  userCheckAuth,
  userCheckPerm('client.delete.own'),
  pauseController,
  clientPartOfMyCompany,
  clientDeleteById,
);

// router.get(
//   '/stats',
//   serviceHeader('userStats'),
//   userCheckAuth,
//   userCheckPerm('user.stats'),
//   clientStats,
// );

module.exports = router;
