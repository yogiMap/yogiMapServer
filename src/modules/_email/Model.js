const mongoose = require('mongoose');

const Schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    email: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: false,
    },

    isRead: {
      type: Boolean,
      required: false,
    },
  },

  { timestamps: {}, versionKey: false },
);

module.exports = mongoose.model('Email', Schema);
