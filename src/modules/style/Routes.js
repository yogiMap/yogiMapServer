const { Router } = require('express');
const serviceHeader = require('../utils/serviceHeader');
const { userCheckPerm } = require('../permission/userCheckPerm');

const styleCreate = require('./controllers/create');
const userCheckAuth = require('../user/middlewares/userCheckAuth');
const styleGetById = require('./controllers/getById');
const styleSearch = require('./controllers/search');
const styleUpdateById = require('./controllers/updateById');
const styleDeleteById = require('./controllers/deleteById');
const styleStats = require('./controllers/stats');
const pauseController = require('../core/pauseController');

const router = Router();

// CRUD

router.get(
  '/stats', // GET /localhost:5000/style/stats
  serviceHeader('styleStats'), // mark request
  // userCheckAuth, // midlware  needed to check if user has rights to do the request
  // userCheckPerm('style.search.own'), // midlware has rights to do this operation such as style.search.own
  // pauseController,
  styleStats,
);

router.post(
  '/', // POST /localhost:5000/style/stats
  serviceHeader('styleCreate'),
  userCheckAuth,
  userCheckPerm('style.create.own'),
  // pauseController,
  styleCreate,
);

router.get(
  '/:styleId',
  serviceHeader('styleGetById'),
  // userCheckAuth,
  // userCheckPerm('style.get.own'),
  // pauseController,
  styleGetById,
);

router.post(
  '/search',
  serviceHeader('styleSearch'),
  // userCheckAuth,
  // userCheckPerm('style.search.own'),
  // pauseController,
  styleSearch,
);

router.patch(
  '/:styleId',
  serviceHeader('styleUpdateById'),
  userCheckAuth,
  userCheckPerm('style.update.own'),
  pauseController,
  styleUpdateById,
);

router.delete(
  '/:styleId',
  serviceHeader('styleDeleteById'),
  userCheckAuth,
  userCheckPerm('style.delete.own'),
  pauseController,
  styleDeleteById,
);

module.exports = router;
