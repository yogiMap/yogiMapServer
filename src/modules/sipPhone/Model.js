const mongoose = require('mongoose');

const Schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    phoneNumber: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    twilio: {
      accountSid: {
        type: String,
        required: true,
      },
      authToken: {
        type: String,
        required: true,
      },
    },

    teacherAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeacherAccount',
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },

  { timestamps: {}, versionKey: false },
);

module.exports = mongoose.model('SipPhone', Schema);
