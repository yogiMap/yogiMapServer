const mongoose = require('mongoose');

const Schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: false,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    messageBody: {
      type: String,
      required: true,
    },

    direction: {
      type: String,
      required: true,
    },

    from: {
      type: String,
      required: true,
    },

    to: {
      type: String,
      required: true,
    },

    teacherAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeacherAccount',
      required: true,
    },
  },

  { timestamps: {}, versionKey: false },
);

module.exports = mongoose.model('Message', Schema);
