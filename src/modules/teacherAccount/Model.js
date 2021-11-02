const mongoose = require('mongoose');
const focusList = require('../lists/focusList');
const { timeZoneList } = require('../lists/timeZoneList');
const { emailRegExp } = require('../utils/validators');

const tzList = timeZoneList.map((el) => el.timeZone);
const fList = focusList.map((el) => el.name);

const Schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    code: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      unique: false,
      required: true,
      trim: false,
      default: '',
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: false,
      match: emailRegExp,
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

    coords: {
      lat: { type: String, required: false },
      lng: { type: String, required: false },
    },

    focus: {
      type: String,
      enum: fList,
      required: false,
    },

    description: {
      type: String,
      required: false,
    },

    style: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Style',
      required: false,
    },

    classType: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassType',
        required: false,
      },
    ],

    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classes',
        required: false,
      },
    ],

    event: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: false,
      },
    ],

    isTeacher: {
      type: Boolean,
      default: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    image: [{ type: String }],
  },

  { timestamps: {}, versionKey: false },
);

module.exports = mongoose.model('TeacherAccount', Schema);
