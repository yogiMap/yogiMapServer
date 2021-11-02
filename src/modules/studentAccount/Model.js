const mongoose = require('mongoose');
const focusList = require('../lists/focusList');
const { timeZoneList } = require('../lists/timeZoneList');
//const { countriesWithCode } = require'../lists/countryList';

const tzList = timeZoneList.map((el) => el.timeZone);
const fList = focusList.map((el) => el.name);
// const countriesList = countriesWithCode.map((el) => el.countryName);

const Schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    firstName: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      match: /^[A-Za-z\-']{1,20}$/,
      default: '',
    },

    lastName: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      match: /^[A-Za-z\-']{1,20}$/,
      default: '',
    },

    description: {
      type: String,
      required: false,
    },

    focus: [
      {
        type: String,
        enum: fList,
        required: false,
      },
    ],

    // Указатель на словарь Activity. Types: (calls, emails, messages, tasks)
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: false,
      },
    ],

    isTeacher: {
      type: Boolean,
      default: false,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    phoneNumber: {
      type: Object,
      required: false,
    },

    address: {
      type: String,
      required: false,
    },

    addressLine1: {
      type: String,
      required: false,
    },

    addressLine2: {
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

    country: {
      type: String,
      required: false,
      // enum: countriesList,
    },

    zipCode: {
      type: String,
      required: false,
    },

    timeZone: {
      type: String,
      enum: tzList,
      required: false,
    },
  },
  { timestamps: {}, versionKey: false },
);

module.exports = mongoose.model('StudentAccount', Schema);
