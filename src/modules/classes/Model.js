const mongoose = require('mongoose');
const { focusList } = require('../lists/focusList');

const Schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    code: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: false,
      default: new Date(0),
    },

    duration: {
      type: String,
      required: true,
    },

    focus: [
      {
        type: String,
        enum: focusList,
        required: false,
      },
    ],

    style: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Style',
      required: false,
    },

    classType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassType',
      required: false,
    },

    teacherAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeacherAccount',
      required: false,
    },

    description: {
      type: String,
      required: false,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // tags: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Tags',
    //     required: false,
    //   },
    // ],
  },
  { timestamps: {}, versionKey: false },
);

module.exports = mongoose.model('Classes', Schema);
