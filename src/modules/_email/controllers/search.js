const Email = require( '../Model');
const message = require( '../../utils/messages');
const { get } = require( 'lodash');
const analytics = require( '../../analytics/controllers/analytics');
const paginationSearchFormatter = require( '../../utils/paginationSearchFormatter');

// Поиск с пагинацией

const emailSearch = async (req, res) => {
  const userId = get(req, 'user._id');

  try {
    let limit = +get(req, 'body.limit', 20);
    limit = limit > 100 ? 100 : limit; // показать не больше 100
    const page = +get(req, 'body.page', 1);

    // параметры поиска
    const email = get(req, 'body.email', '');

    if (!email) {
      return res.status(200).json(message.success('No email', []));
    }

    // формирование запроса
    const query = {};
    query.email = { $eq: email };

    const totalCountPromise = Email.countDocuments(query); // Находим кол-во результатов
    const searchPromise = emailSearchQuery({ query, page, limit }); // Находим результат

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

    res.status(200).json(message.success('EmailSearch ok', result));
  } catch (error) {
    const analyticsId = analytics('EMAIL_SEARCH_ERROR', {
      error,
      body: req.body,
      entity: 'Email',
      user: userId,
      controller: 'emailSearch',
    });

    res.status(400).json(message.fail('EmailSearch error', analyticsId));
  }
};

function emailSearchQuery({ query, page, limit }) {
  return Email.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1))
    .exec()
    .then((docs) => {
      return message.success('Email found', docs);
    });
}

module.exports = emailSearch;
