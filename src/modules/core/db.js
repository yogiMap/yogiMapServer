const mongoose = require('mongoose');

const connectionString = process.env.MONGO_CONNECTION_STRING;

const options = {
  useNewUrlParser: true,
  autoIndex: false,
  useUnifiedTopology: true,
};

function mongoConnection() {
  mongoose.connect(connectionString, options).catch((err) => console.log(err));

  // When the connection is disconnected
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
  });
}

module.exports = {
  options,
  connectionString,
  mongoConnection,
};
