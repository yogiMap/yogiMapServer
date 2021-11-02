const mongoose = require('mongoose');
const { emailRegExp } = require('../utils/validators');

const Schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    code: {
      type: String,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      match: /^.{1,20}$/,
      default: '',
    },

    lastName: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      match: /^.{1,20}$/,
      default: '',
    },

    name: {
      type: String,
      unique: false,
      trim: true,
      default: '',
    },

    company: {
      type: String,
      unique: false,
      trim: true,
      default: '',
      required: false,
    },

    email: {
      type: String,
      required: false,
      unique: true,
      match: emailRegExp,
    },

    teacherAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeacherAccount',
      required: true,
    },

    phoneNumber: {
      type: Object,
      required: false,
    },

    // customerStripeId: {
    //   type: String,
    //   required: false,
    // },

    // Указатель на словарь Activity. Types: (calls, emails, messages, tasks)
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: false,
      },
    ],

    // Указатель на словарь Address
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: false,
      },
    ],

    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: false,
      },
    ],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: {}, versionKey: false },
);

module.exports = mongoose.model('Client', Schema);
