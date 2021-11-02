const { Router } = require('express');
const serviceHeader = require('../utils/serviceHeader');
const getCountryList = require('./controllers/getCountryList');
const getCountryStateList = require('./controllers/getCountryStateList');
const userCheckAuth = require('../user/middlewares/userCheckAuth');
const getTimeZoneList = require('./controllers/getTimeZoneList');
const pauseController = require('../core/pauseController');
const getFocusList = require('./controllers/getFocusList');
const focusSearch = require('./controllers/searchFocusList');

const router = Router();

router.get(
  '/countries',
  serviceHeader('getCountryList'),
  userCheckAuth,
  pauseController,
  getCountryList,
);

router.get(
  '/states/:country',
  serviceHeader('getCountryStateList'),
  userCheckAuth,
  pauseController,
  getCountryStateList,
);

router.get(
  '/focus',
  serviceHeader('getFocusList'),
  // userCheckPerm('focus.get.own'),
  userCheckAuth,
  pauseController,
  getFocusList,
);

router.post(
  '/search',
  serviceHeader('focusSearch'),
  userCheckAuth,
  //userCheckPerm('focus.search.own'),
  // pauseController,
  pauseController,
  focusSearch,
);

router.get('/timeZone', serviceHeader('getTimeZoneList'), userCheckAuth, getTimeZoneList);

module.exports = router;
