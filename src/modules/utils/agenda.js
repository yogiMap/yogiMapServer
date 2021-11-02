// Agenda full documentation: https://www.npmjs.com/package/agenda
const Agenda = require('agenda');

const connectionString = 'mongodb://localhost:27017/codewars';

(async function run() {
  //  If no collection name is given, agendaOrders is used.
  // options not required, used to overwrite default
  let configureMongoDBObj = {
    db: {
      address: connectionString,
      collection: 'orders',
      options: {
        useNewUrlParser: true,
      },
    },
  };

  let agenda = new Agenda(configureMongoDBObj);

  // Defines a order with the name of orderName. When a order of orderName gets run,
  // it will be passed to fn(order, done). To maintain asynchronous behavior,
  // you may either provide a Promise-returning function in fn or provide done as a
  // second parameter to fn. If done is specified in the function signature,
  // you must call done() when you are processing the order. If your function is
  // synchronous or returns a Promise, you may omit done from the signature.

  agenda.define('ORDER_ONE', (order, done) => {
    console.log('order one fired here');
    done();
  });

  agenda.define('ORDER_TWO', (order, done) => {
    console.log('ORDER TWO fired here');
    done();
  });

  agenda.define('ORDER_THREE', (order, done) => {
    console.log('ORDER three in every minute here');
    done();
  });

  await agenda.on('ready', function () {
    // Agenda will emit a ready event when properly connected to the database.
    // error - called when Agenda mongo connection process has thrown an error
    console.log('Agenda orders started');
    agenda.start();
    //schedule once
    // Agenda uses Human Interval for specifying the intervals
    agenda.schedule('one minute', 'ORDER_ONE');
    // Name could be array of order names, which is convenient for
    // scheduling different orders for same interval.
    agenda.schedule('2.5 minute', 'ORDER_ONE');
    agenda.schedule('3 minutes', 'ORDER_TWO');
    agenda.schedule('4 minutes', 'ORDER_THREE');
    //repeat
    agenda.every('1 minute', 'ORDER_3');
  });
})();
