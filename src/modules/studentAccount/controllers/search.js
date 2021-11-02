const StudentAccount = require('../Model');
const message = require('../../utils/messages');
const { get } = require('lodash');
const escapeRegExp = require('../../utils/escapeRegExp');
const analytics = require('../../analytics/controllers/analytics');
const paginationSearchFormatter = require('../../utils/paginationSearchFormatter');

// Поиск с пагинацией

const studentAccountSearch = async (req, res) => {
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

    const totalCountPromise = StudentAccount.countDocuments(query); // Находим кол-во результатов
    const searchPromise = studentAccountSearchQuery({ query, page, limit }); // Находим результат

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

    res.status(200).json(message.success('StudentAccountSearch ok', result));
  } catch (error) {
    const analyticsId = analytics('StudentAccount_SEARCH_ERROR', {
      error,
      body: req.body,
      entity: 'StudentAccount',
      user: userId,
      controller: 'studentAccountSearch',
    });

    res.status(400).json(message.fail('StudentAccountSearch error', analyticsId));
  }
};

module.exports = studentAccountSearch;

function studentAccountSearchQuery({ query, page, limit }) {
  return StudentAccount.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1))

    .populate({
      path: 'owner',
      select: 'name',
    })

    .exec()
    .then((docs) => {
      return message.success('StudentAccount found', docs);
    });
}
