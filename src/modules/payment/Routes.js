const { Router } = require('express');
const serviceHeader = require('../utils/serviceHeader');
const { userCheckPerm } = require('../permission/userCheckPerm');
const paymentCreate = require('./controllers/create');
const userCheckAuth = require('../user/middlewares/userCheckAuth');
const paymentGetById = require('./controllers/getById');
const paymentSearch = require('./controllers/search');
const paymentUpdateById = require('./controllers/updateById');
const paymentDeleteById = require('./controllers/deleteById');
const paymentStats = require('./controllers/stats');
const pauseController = require('../core/pauseController');
const paymentGetAll = require('./controllers/getAll');
const getStripeEvents = require('./controllers/stripeEventListener');
const getPaymentsByOrder = require('./controllers/getByOrder');

const router = Router();

router.get(
  '/stats',
  serviceHeader('paymentStats'),
  userCheckAuth,
  userCheckPerm('payment.search.own'),
  pauseController,
  paymentStats,
);

router.get(
  '/',
  serviceHeader('paymentGetAll'),
  userCheckAuth,
  userCheckPerm('payment.search.own'),
  pauseController,
  paymentGetAll,
);

router.get(
  '/order/:orderId',
  serviceHeader('getPaymentsByOrder'),
  userCheckAuth,
  userCheckPerm('payment.get.own'),
  pauseController,
  getPaymentsByOrder,
);

router.post(
  '/',
  serviceHeader('paymentCreate'),
  userCheckAuth,
  userCheckPerm('payment.create.own'),
  pauseController,
  paymentCreate,
);

router.get(
  '/:paymentId',
  serviceHeader('paymentGetById'),
  userCheckAuth,
  userCheckPerm('payment.get.own'),
  pauseController,
  paymentGetById,
);

router.post(
  '/search',
  serviceHeader('paymentSearch'),
  userCheckAuth,
  userCheckPerm('payment.search.own'),
  pauseController,
  paymentSearch,
);

router.patch(
  '/:paymentId',
  serviceHeader('paymentUpdateById'),
  userCheckAuth,
  userCheckPerm('payment.update.own'),
  pauseController,
  paymentUpdateById,
);

router.delete(
  '/:paymentId',
  serviceHeader('paymentDeleteById'),
  userCheckAuth,
  userCheckPerm('payment.delete.own'),
  pauseController,
  paymentDeleteById,
);

router.post('/stripeHook', getStripeEvents);

module.exports = router;
