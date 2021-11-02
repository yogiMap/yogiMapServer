const config = {};

config.session = {
  secret: 'yogimapsecret',
  collection: 'sessions',
  proxy: true,
  // domain: 'yogimap.com',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 1800 * 60 * 1000,
    // 1800 - 300 часов
    // sameSite: process.env.NODE_ENV === 'development' ? 'none' : true,
    // secure: process.env.NODE_ENV === 'development' ? true : false,

    // sameSite: 'none',
    // secure: false,
  },
};

config.oauth = {
  facebookAuth: {
    clientID: 'your_client_id',
    clientSecret: 'your_client_secret',
    callbackURL: '/...facebook/callback',
  },
  googleAuth: {
    clientID: 'your_client_id',
    clientSecret: 'your_client_secret',
    callbackURL: '/...google/callback',
  },
  // vkontakteAuth: {
  //   clientID: 'your_client_id',
  //   clientSecret: 'your_client_secret',
  // },
};

module.exports = config;
