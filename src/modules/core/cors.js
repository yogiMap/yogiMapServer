module.exports = function cors(app) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_HOST);
    res.header('Access-Control-Allow-Credentials', true);
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    next();
  });
};

// module.exports = function cors(app) {
//   app.use((req, res, next) => {
//     // eslint-disable-line consistent-return
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header(
//       'Access-Control-Allow-Headers',
//       'Origin, X-Requested-With, Content-Type, Accept, Authorization',
//     );
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//     // if (req.method === 'OPTIONS') {
//     //   return res.status(200).json({});
//     // }
//     next();
//   });
// };
