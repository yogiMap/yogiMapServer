const Event = require('../Model');
const message = require('../../utils/messages');
const { get } = require('lodash');
const escapeRegExp = require('../../utils/escapeRegExp');
const analytics = require('../../analytics/controllers/analytics');
const paginationSearchFormatter = require('../../utils/paginationSearchFormatter');
const search = require('../queries/search');
// Поиск с пагинацией

const eventSearch = async (req, res) => {
  const userId = get(req, 'user._id');
  const teacherAccountId = get(req, 'user.teacherAccount');

  try {
    let limit = +get(req, 'body.limit', 20);
    limit = limit > 100 ? 100 : limit; // показать не больше 100
    const page = +get(req, 'body.page', 1);

    // параметры поиска
    const name = get(req, 'body.name', '');
    // const accessType = get(req, 'body.accessType', 'all');

    // формирование запроса
    const query = {};

    if (name) {
      query.name = { $regex: escapeRegExp(name), $options: 'i' };
    }

    // if (accessType) {
    //   query.accessType = { $eq: accessType };
    // }

    if (teacherAccountId) {
      query.teacherAccount = { $eq: teacherAccountId };
    }

    if (userId) {
      query.owner = { $eq: userId };
    }

    const totalCountPromise = Event.countDocuments(query); // Находим кол-во результатов
    const searchPromise = search({ query, page, limit }); // Находим результат

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

    res.status(200).json(message.success('EventSearch ok', result));
  } catch (error) {
    const analyticsId = analytics('EVENT_SEARCH_ERROR', {
      error,
      body: req.body,
      entity: 'Event',
      user: userId,
      controller: 'eventSearch',
    });

    res.status(400).json(message.fail('EventSearch error', analyticsId));
  }
};

module.exports = eventSearch;

function eventSearchQuery({ query, page, limit }) {
  return Event.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1))
    .exec()
    .then((docs) => {
      return message.success('Event found', docs);
    });
}
