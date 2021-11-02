const mongoose = require('mongoose');
const { listRoles } = require('../permission/roles');
const { emailRegExp } = require('../utils/validators');
// const { countriesWithCode } = require('../lists/countryList');

// const countriesList = countriesWithCode.map((el) => el.countryName);

const userSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    timeZone: {
      type: String,
      default: 'America/Los_Angeles',
      required: false,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: emailRegExp,
    },

    emailConfirmation: {
      hash: { type: String },
      confirmed: {
        type: Boolean,
        default: false,
      },
    },

    password: {
      type: String,
      select: false,
      required: true,
    },

    name: {
      type: String,
      unique: false,
      trim: true,
      default: '',
    },

    firstName: {
      type: String,
      required: false,
      trim: true,
      match: /^[A-Za-z\-']{1,20}$/,
      default: '',
    },

    lastName: {
      type: String,
      required: false,
      trim: true,
      match: /^[A-Za-z\-']{1,20}$/,
      default: '',
    },

    phoneNumber: {
      type: Object,
      required: false,
      unique: true,
      match: /^[0-9]{11,12}$/,
    },

    avatar: [{ type: String }],

    resetPassword: {
      hash: { type: String, select: false },
      date: {
        select: false,
        type: Date,
        required: false,
      },
      history: [
        {
          date: Date,
        },
      ],
    },

    roles: [
      {
        type: String,
        required: false,
        enum: listRoles,
      },
    ],

    studentAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentAccount',
      required: false,
    },

    teacherAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeacherAccount',
      required: false,
    },

    sipPhone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SipPhone',
      required: false,
    },

    isTeacher: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      date: {
        type: Date,
        required: false,
        default: new Date(0),
      },
    },

    personalAddress: {
      countryName: {
        type: String,
        required: false,
      },
      countryCode: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      state: {
        type: String,
        required: false,
      },
      zipCode: {
        type: String,
        required: false,
      },
    },
  },

  { timestamps: {}, versionKey: false },
);

module.exports = mongoose.model('User', userSchema);
