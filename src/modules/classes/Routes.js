const { Router } = require('express');
const serviceHeader = require('../utils/serviceHeader');
const { userCheckPerm } = require('../permission/userCheckPerm');

const classesCreate = require('./controllers/create');
const userCheckAuth = require('../user/middlewares/userCheckAuth');
const classesGetById = require('./controllers/getById');
const classesSearch = require('./controllers/search');
const classesUpdateById = require('./controllers/updateById');
const classesDeleteById = require('./controllers/deleteById');
const classesStats = require('./controllers/stats');
const pauseController = require('../core/pauseController');

const router = Router();

// CRUD

router.get(
  '/stats', // GET /localhost:5000/classes/stats
  serviceHeader('classesStats'), // mark request
  userCheckAuth, // midlware  needed to check if user has rights to do the request
  userCheckPerm('classes.search.own'), // midlware has rights to do this operation such as classeses.search.own
  pauseController,
  classesStats,
);

router.post(
  '/', // POST /localhost:5000/classeses/stats
  serviceHeader('classesCreate'),
  userCheckAuth,
  userCheckPerm('classes.create.own'),
  // pauseController,
  classesCreate,
);

router.get(
  '/:classesId',
  serviceHeader('classesGetById'),
  userCheckAuth,
  userCheckPerm('classes.get.own'),
  pauseController,
  classesGetById,
);

router.post(
  '/search',
  serviceHeader('classesSearch'),
  // userCheckAuth,
  // userCheckPerm('classes.search.own'),
  // pauseController,
  classesSearch,
);

router.patch(
  '/:classesId',
  serviceHeader('classesUpdateById'),
  userCheckAuth,
  userCheckPerm('classes.update.own'),
  pauseController,
  classesUpdateById,
);

router.delete(
  '/:classesId',
  serviceHeader('classesDeleteById'),
  userCheckAuth,
  userCheckPerm('classes.delete.own'),
  pauseController,
  classesDeleteById,
);

module.exports = router;
