const TeacherAccount = require('../Model');
const message = require('../../utils/messages');
const { get } = require('lodash');
const escapeRegExp = require('../../utils/escapeRegExp');
const analytics = require('../../analytics/controllers/analytics');
const paginationSearchFormatter = require('../../utils/paginationSearchFormatter');
const search = require('../queries/search');

// Поиск с пагинацией

const teacherAccountSearch = async (req, res) => {
  const userId = get(req, 'user._id');

  try {
    let limit = +get(req, 'body.limit', 20);
    limit = limit > 100 ? 100 : limit; // показать не больше 100
    const page = +get(req, 'body.page', 1);

    // параметры поиска
    const name = get(req, 'body.name', '');
    const styleName = get(req, 'body.style.name', '');
    const focus = get(req, 'body.focus', '');
    const country = get(req, 'body.country', '');
    const city = get(req, 'body.city', '');

    // формирование запроса
    const query = {};

    if (userId) {
      query.owner = { $eq: userId };
    }

    if (name) {
      query.name = { $regex: escapeRegExp(name), $options: 'i' };
    }

    if (styleName) {
      query.style = { $regex: escapeRegExp(styleName), $options: 'i' };
    }

    if (focus) {
      query.focus = { $regex: escapeRegExp(focus), $options: 'i' };
    }

    if (country) {
      query.country = { $regex: escapeRegExp(country), $options: 'i' };
    }

    if (city) {
      query.city = { $regex: escapeRegExp(city), $options: 'i' };
    }

    const totalCountPromise = TeacherAccount.countDocuments(query); // Находим кол-во результатов
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

    res.status(200).json(message.success('TeacherAccountSearch ok', result));
  } catch (error) {
    const analyticsId = analytics('TEACHER_ACCOUNT_SEARCH_ERROR', {
      error,
      body: req.body,
      entity: 'TeacherAccount',
      user: userId,
      controller: 'teacherAccountSearch',
    });

    res.status(400).json(message.fail('TeacherAccountSearch error', analyticsId));
  }
};
module.exports = teacherAccountSearch;
