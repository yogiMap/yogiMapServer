const Message = require('../Model');
const message = require('../../../utils/messages');
const { get } = require('lodash');
const escapeRegExp = require('../../../utils/escapeRegExp');
const analytics = require('../../../analytics/controllers/analytics');
const paginationSearchFormatter = require('../../../utils/paginationSearchFormatter');
const messageSearchQuery = require('../queries/search');

// Поиск с пагинацией
const messageSearch = async (req, res) => {
  let limit = +get(req, 'body.limit', 10);
  limit = limit > 100 ? 100 : limit; // показать не больше 100
  const page = +get(req, 'body.page', 1);
  const userId = get(req, 'user._id');
  const client = get(req, 'body.clientId');
  // формирование запроса
  const teacherAccountId = get(req, 'user.teacherAccount');

  const query = {};

  if (!teacherAccountId) {
    return res.status(400).json(message.fail('No Teacher account'));
  }

  query.teacherAccount = { $eq: teacherAccountId };

  if (client) {
    query.client = { $eq: client };
  }

  const totalCountPromise = Message.countDocuments(query); // Находим кол-во результатов
  const searchPromise = messageSearchQuery({ query, page, limit }); // Находим результат

  // Запускаем запросы параллельно
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

    res.status(200).json(message.success('MessageSearch ok', result));
  } else {
    const analyticsId = analytics('MESSAGE_SEARCH_ERROR', {
      error: searchResult.payload,
      body: req.body,
      entity: 'Message',
      user: userId,
      controller: 'messageSearch',
    });

    res.status(400).json(message.fail('MessageSearch error', analyticsId));
  }
};

module.exports = messageSearch;
