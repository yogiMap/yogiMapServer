const Client = require('../Model');
const message = require('../../utils/messages');
const { get } = require('lodash');
const escapeRegExp = require('../../utils/escapeRegExp');
const analytics = require('../../analytics/controllers/analytics');
const paginationSearchFormatter = require('../../utils/paginationSearchFormatter');
const clientSearchQuery = require('../queries/search');

// Поиск с пагинацией

const clientSearch = async (req, res) => {
  const userId = get(req, 'user._id');
  const teacherAccountId = get(req, 'user.teacherAccount');

  try {
    let limit = +get(req, 'body.limit', 20);
    limit = limit > 100 ? 100 : limit; // показать не больше 100
    const page = +get(req, 'body.page', 1);

    // параметры поиска
    const name = get(req, 'body.name', '');
    //const company = get(req, 'body.company', '');
    // const accessType = get(req, 'body.accessType', 'all');

    // формирование запроса
    const query = {};

    if (teacherAccountId) {
      query.teacherAccount = { $eq: teacherAccountId };
    }

    if (name) {
      query.name = { $regex: escapeRegExp(name), $options: 'i' };
    }

    // if (company) {
    //   query.company = { $regex: escapeRegExp(company), $options: 'i' };
    // }
    //
    // if (accessType) {
    //   query.accessType = { $eq: accessType };
    // }

    const totalCountPromise = Client.countDocuments(query); // Находим кол-во результатов
    const searchPromise = clientSearchQuery({ query, page, limit }); // Находим результат

    // Запускаем запросы параллельно
    const PromiseAllResult = await Promise.all([totalCountPromise, searchPromise]);

    const searchResultCount = PromiseAllResult[0];
    const searchResult = PromiseAllResult[1];

    const result = paginationSearchFormatter({
      page,
      limit,
      searchResultCount,
      searchResult: searchResult.payload,
    });

    res.status(200).json(message.success('ClientSearch ok', result));
  } catch (error) {
    const analyticsId = analytics('CLIENT_SEARCH_ERROR', {
      error,
      body: req.body,
      entity: 'Client',
      user: userId,
      controller: 'clientSearch',
    });

    res.status(400).json(message.fail('ClientSearch error', analyticsId));
  }
};

module.exports = clientSearch;
