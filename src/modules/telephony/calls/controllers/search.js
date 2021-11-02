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
  // параметры поиска
  const searchParam1 = get(req, 'body.searchParam1', '');
  const searchParam2 = get(req, 'body.searchParam2', '');
  // const accessType = get(req, 'body.accessType', 'all');
  // формирование запроса

  const query = {};

  if (client) {
    query.client = { $eq: client };
  }

  //   if (address) {
  //     query.address = { $regex: escapeRegExp(address), $options: 'i' };
  //   }
  // if (accessType) {
  //   query.accessType = { $eq: accessType };
  // }
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
