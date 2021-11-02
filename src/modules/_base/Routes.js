const { Router } = require('express');
const serviceHeader = require('../utils/serviceHeader');
const { userCheckPerm } = require('../permission/userCheckPerm');

const baseCreate = require('./controllers/create');
const userCheckAuth = require('../user/middlewares/userCheckAuth');
const baseGetById = require('./controllers/getById');
const baseSearch = require('./controllers/search');
const baseUpdateById = require('./controllers/updateById');
const baseDeleteById = require('./controllers/deleteById');
const baseStats = require('./controllers/stats');
const pauseController = require('../core/pauseController');

const router = Router();

// CRUD

router.get(
  '/stats', // GET /localhost:5000/base/stats
  serviceHeader('baseStats'), // mark request
  userCheckAuth, // midlware  needed to check if user has rights to do the request
  userCheckPerm('base.search.own'), // midlware has rights to do this operation such as base.search.own
  pauseController,
  baseStats,
);

router.post(
  '/', // POST /localhost:5000/base
  serviceHeader('baseCreate'),
  userCheckAuth,
  userCheckPerm('base.create.own'),
  // pauseController,
  baseCreate,
);

router.get(
  '/:baseId',
  serviceHeader('baseGetById'),
  userCheckAuth,
  userCheckPerm('base.get.own'),
  pauseController,
  baseGetById,
);

router.post(
  '/search',
  serviceHeader('baseSearch'),
  userCheckAuth,
  userCheckPerm('base.search.own'),
  pauseController,
  baseSearch,
);

router.patch(
  '/:baseId',
  serviceHeader('baseUpdateById'),
  userCheckAuth,
  userCheckPerm('base.update.own'),
  pauseController,
  baseUpdateById,
);

router.delete(
  '/:baseId',
  serviceHeader('baseDeleteById'),
  userCheckAuth,
  userCheckPerm('base.delete.own'),
  pauseController,
  baseDeleteById,
);

module.exports = router;
