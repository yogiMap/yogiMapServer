const { Router } = require('express');
const serviceHeader = require('../utils/serviceHeader');
const { userCheckPerm } = require('../permission/userCheckPerm');
const classTypeCreate = require('./controllers/create');
const userCheckAuth = require('../user/middlewares/userCheckAuth');
const classTypeGetById = require('./controllers/getById');
const classTypeSearch = require('./controllers/search');
const classTypeUpdateById = require('./controllers/updateById');
const classTypeDeleteById = require('./controllers/deleteById');
const classTypeStats = require('./controllers/stats');
const pauseController = require('../core/pauseController');

const router = Router();

// CRUD

router.get(
  '/stats', // GET /localhost:5000/classType/stats
  serviceHeader('classTypeStats'), // mark request
  // userCheckAuth, // midlware  needed to check if user has rights to do the request
  // userCheckPerm('classType.search.own'), // midlware has rights to do this operation such as classType.search.own
  // pauseController,
  classTypeStats,
);

router.post(
  '/', // POST /localhost:5000/classType/stats
  serviceHeader('classTypeCreate'),
  userCheckAuth,
  // userCheckPerm('classType.create.own'),
  // pauseController,
  classTypeCreate,
);

router.get(
  '/:classTypeId',
  serviceHeader('classTypeGetById'),
  // userCheckAuth,
  // userCheckPerm('classType.get.own'),
  // pauseController,
  classTypeGetById,
);

router.post(
  '/search',
  serviceHeader('classTypeSearch'),
  // userCheckAuth,
  // userCheckPerm('classType.search.own'),
  // pauseController,
  classTypeSearch,
);

router.patch(
  '/:classTypeId',
  serviceHeader('classTypeUpdateById'),
  userCheckAuth,
  userCheckPerm('classType.update.own'),
  pauseController,
  classTypeUpdateById,
);

router.delete(
  '/:classTypeId',
  serviceHeader('classTypeDeleteById'),
  userCheckAuth,
  userCheckPerm('classType.delete.own'),
  pauseController,
  classTypeDeleteById,
);

module.exports = router;
