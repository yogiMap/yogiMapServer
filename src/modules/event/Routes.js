const { Router } = require('express');
const serviceHeader = require('../utils/serviceHeader');
const { userCheckPerm } = require('../permission/userCheckPerm');

const eventCreate = require('./controllers/create');
const userCheckAuth = require('../user/middlewares/userCheckAuth');
const eventGetById = require('./controllers/getById');
const eventSearch = require('./controllers/search');
const eventUpdateById = require('./controllers/updateById');
const eventDeleteById = require('./controllers/deleteById');
const eventStats = require('./controllers/stats');
const pauseController = require('../core/pauseController');

const router = Router();

// CRUD

router.get(
  '/stats', // GET /localhost:5000/event/stats
  serviceHeader('eventStats'), // mark request
  // userCheckAuth, // midlware  needed to check if user has rights to do the request
  // userCheckPerm('event.search.own'), // midlware has rights to do this operation such as event.search.own
  // pauseController,
  eventStats,
);

router.post(
  '/', // POST /localhost:5000/event/stats
  serviceHeader('eventCreate'),
  userCheckAuth,
  userCheckPerm('event.create.own'),
  // pauseController,
  eventCreate,
);

router.get(
  '/:eventId',
  serviceHeader('eventGetById'),
  // userCheckAuth,
  // userCheckPerm('event.get.own'),
  // pauseController,
  eventGetById,
);

router.post(
  '/search',
  serviceHeader('eventSearch'),
  // userCheckAuth,
  // userCheckPerm('event.search.own'),
  // pauseController,
  eventSearch,
);

router.patch(
  '/:eventId',
  serviceHeader('eventUpdateById'),
  userCheckAuth,
  userCheckPerm('event.update.own'),
  pauseController,
  eventUpdateById,
);

router.delete(
  '/:eventId',
  serviceHeader('eventDeleteById'),
  userCheckAuth,
  userCheckPerm('event.delete.own'),
  pauseController,
  eventDeleteById,
);

module.exports = router;
