const Classes = require('../Model');
const message = require('../../utils/messages');
const { get } = require('lodash');
const escapeRegExp = require('../../utils/escapeRegExp');
const analytics = require('../../analytics/controllers/analytics');
const paginationSearchFormatter = require('../../utils/paginationSearchFormatter');
const search = require('../queries/search');
// Поиск с пагинацией

const classesSearch = async (req, res) => {
  const userId = get(req, 'user._id');
  const teacherAccountId = get(req, 'user.teacherAccount');

  try {
    let limit = +get(req, 'body.limit', 20);
    limit = limit > 100 ? 100 : limit; // показать не больше 100
    const page = +get(req, 'body.page', 1);

    // параметры поиска
    const name = get(req, 'body.name', '');
    // const accessType = get(req, 'body.accessType', 'all');

    // параметры поиска
    const calendarRangeStart = get(req, 'body.start', '');
    const calendarRangeEnd = get(req, 'body.end', '');
    const calendarView = get(req, 'body.view', '');

    // формирование запроса
    let query = {};

    if (name) {
      query.name = { $regex: escapeRegExp(name), $options: 'i' };
    }

    if (teacherAccountId) {
      query.teacherAccount = { $eq: teacherAccountId };
    }

    if (userId) {
      query.owner = { $eq: userId };
    }

    if (calendarRangeStart && calendarRangeEnd) {
      query = {
        $or: [
          {
            date: {
              $gte: calendarRangeStart,
              $lte: calendarRangeEnd,
            },
          },
          {
            date: {
              $lte: calendarRangeStart,
            },
          },
        ],
      };
    }

    // if (accessType) {
    //   query.accessType = { $eq: accessType };
    // }

    const totalCountPromise = Classes.countDocuments(query); // Находим кол-во результатов
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

    res.status(200).json(message.success('ClassesSearch ok', result));
  } catch (error) {
    const analyticsId = analytics('CLASSES_SEARCH_ERROR', {
      error,
      body: req.body,
      entity: 'Classes',
      user: userId,
      controller: 'classesSearch',
    });

    res.status(400).json(message.fail('ClassesSearch error', analyticsId));
  }
};

module.exports = classesSearch;
