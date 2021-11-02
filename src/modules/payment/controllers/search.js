const message = require('../../utils/messages');
const { get } = require('lodash');
const escapeRegExp = require('../../utils/escapeRegExp');
const analytics = require('../../analytics/controllers/analytics');
const paginationSearchFormatter = require('../../utils/paginationSearchFormatter');
const paymentSearchQuery = require('../queries/search');
const Payment = require('../Model');

const paymentSearch = async (req, res) => {
  const teacherAccountId = get(req, 'user.teacherAccount');

  let limit = +get(req, 'body.limit', 10);
  limit = limit > 100 ? 100 : limit; // показать не больше 100
  const page = +get(req, 'body.page', 1);

  const paymentType = get(req, 'body.paymentType', '');
  const amount = get(req, 'body.amount', 0);
  const client = get(req, 'body.clientId', '');

  const query = {};

  if (teacherAccountId) {
    query.teacherAccount = { $eq: teacherAccountId };
  }
  if (client) {
    query.client = { $eq: client };
  }
  if (paymentType) {
    query.paymentType = { $regex: escapeRegExp(paymentType), $options: 'i' };
  }
  if (amount) {
    query.amount = amount;
  }

  const totalCountPromise = Payment.countDocuments(query);
  const searchPromise = paymentSearchQuery({ query, page, limit });

  const PromiseAllResult = await Promise.all([totalCountPromise, searchPromise]);

  const searchResultCount = PromiseAllResult[0];
  const searchResult = PromiseAllResult[1];

  if (searchResult.success) {
    const result = paginationSearchFormatter({
      page,
      limit,
      searchResultCount,
      searchResult: searchResult.payload,
    });

    res.status(200).json(message.success('Payment Search ok', result));
  } else {
    //
    const analyticsId = analytics('PAYMENT_SEARCH_ERROR', {
      error: PromiseAllResult,
      body: req.body,
      entity: 'Payment',
      user: userId,
      controller: 'paymentSearch',
    });

    res.status(400).json(message.fail('Payment Search error', analyticsId));
  }
};

module.exports = paymentSearch;
