const { Router } = require('express');
const serviceHeader = require('../utils/serviceHeader');
const { userCheckPerm } = require('../permission/userCheckPerm');

const sipPhoneCreate = require('./controllers/create');
const userCheckAuth = require('../user/middlewares/userCheckAuth');
const sipPhoneGetById = require('./controllers/getById');
const sipPhoneSearch = require('./controllers/search');
const sipPhoneUpdateById = require('./controllers/updateById');
const sipPhoneDeleteById = require('./controllers/deleteById');
const sipPhoneStats = require('./controllers/stats');
const pauseController = require('../core/pauseController');
const availablePhoneNumbers = require('./controllers/availablePhoneNumbers');
const buyPhoneNumber = require('./controllers/buyPhoneNumber');
const tollFreePhoneNumbers = require('./controllers/tollFreePhoneNumbers');

const router = Router();

// CRUD

router.get(
  '/stats', // GET /localhost:5000/sipPhone/stats
  serviceHeader('sipPhoneStats'), // mark request
  userCheckAuth, // midlware  needed to check if user has rights to do the request
  userCheckPerm('sipPhone.search.own'), // midlware has rights to do this operation such as sipPhone.search.own
  pauseController,
  sipPhoneStats,
);

router.post(
  '/', // POST /localhost:5000/sipPhone
  serviceHeader('sipPhoneCreate'),
  userCheckAuth,
  userCheckPerm('sipPhone.create.own'),
  // pauseController,
  sipPhoneCreate,
);

router.get(
  '/:sipPhoneId',
  serviceHeader('sipPhoneGetById'),
  userCheckAuth,
  userCheckPerm('sipPhone.get.own'),
  pauseController,
  sipPhoneGetById,
);

router.post(
  '/search',
  serviceHeader('sipPhoneSearch'),
  userCheckAuth,
  userCheckPerm('sipPhone.search.own'),
  pauseController,
  sipPhoneSearch,
);

router.patch(
  '/:sipPhoneId',
  serviceHeader('sipPhoneUpdateById'),
  userCheckAuth,
  userCheckPerm('sipPhone.update.own'),
  pauseController,
  sipPhoneUpdateById,
);

router.delete(
  '/:sipPhoneId',
  serviceHeader('sipPhoneDeleteById'),
  userCheckAuth,
  userCheckPerm('sipPhone.delete.own'),
  pauseController,
  sipPhoneDeleteById,
);

router.post(
  '/availablePhoneNumbers',
  serviceHeader('availablePhoneNumbers'),
  userCheckAuth,
  userCheckPerm('sipPhone.generate.token'),
  availablePhoneNumbers,
);

router.post(
  '/tollFreePhoneNumbers',
  serviceHeader('tollFreePhoneNumbers'),
  userCheckAuth,
  userCheckPerm('sipPhone.generate.token'),
  tollFreePhoneNumbers,
);

router.post(
  '/buyPhoneNumber',
  serviceHeader('buyPhoneNumber'),
  userCheckAuth,
  userCheckPerm('sipPhone.generate.token'),
  buyPhoneNumber,
);

module.exports = router;
