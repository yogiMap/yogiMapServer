const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    code: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: false,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    teacherAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeacherAccount',
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: false,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: false,
    },

    amount: {
      type: Number,
      required: false,
    },

    checkNumber: {
      type: String,
      minlength: 3,
      maxlength: 15,
      required: false,
    },

    creditCardLast4: {
      type: String,
      minlength: 4,
      maxlength: 4,
      required: false,
    },

    creditCardStatus: {
      type: String,
      enum: ['declined', 'success'],
      required: false,
    },

    paymentType: {
      type: String,
      enum: ['cash', 'check', 'credit card'],
      required: false,
    },

    creditCardEmail: {
      type: String,
      maxlength: 100,
      required: false,
    },
  },
  { timestamps: {}, versionKey: false },
);

module.exports = mongoose.model('Payment', paymentSchema);
