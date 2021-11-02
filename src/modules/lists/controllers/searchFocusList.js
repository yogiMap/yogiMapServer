const message = require('../../utils/messages');
const { get } = require('lodash');
const escapeRegExp = require('../../utils/escapeRegExp');
const analytics = require('../../analytics/controllers/analytics');
const paginationSearchFormatter = require('../../utils/paginationSearchFormatter');
const { focusList } = require('../focusList');
// Поиск с пагинацией

const focusSearch = async (req, res) => {
  const userId = get(req, 'user._id');

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

    const totalCountPromise = focusList.countDocuments(query); // Находим кол-во результатов
    const searchPromise = focusSearchQuery({ query, page, limit }); // Находим результат

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

    res.status(200).json(message.success('FocusSearch ok', result));
  } catch (error) {
    const analyticsId = analytics('FOCUS_SEARCH_ERROR', {
      error,
      body: req.body,
      entity: 'Focus',
      user: userId,
      controller: 'focusSearch',
    });

    res.status(400).json(message.fail('FocusSearch error', analyticsId));
  }
};

module.exports = focusSearch;

function focusSearchQuery({ query, page, limit }) {
  return focusList
    .find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1))
    .exec()
    .then((docs) => {
      return message.success('Focus found', docs);
    });
}
