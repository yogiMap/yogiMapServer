const mongoose = require('mongoose');

const callSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    callSid: {
      type: String,
      required: false,
      default: '',
    },

    // Тот кто звонит при исходящем
    callerSipPhone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SipPhone',
      required: false,
    },

    caller: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
      },
      name: {
        type: String,
        required: false,
        default: '',
      },
      // Phone is not required because the Twilio call log can arrive without phone data.
      phone: {
        type: String,
        required: false,
        default: '',
      },
    },

    // тот кому звонят
    callee: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
      },
      name: {
        type: String,
        required: false,
        default: '',
      },
      // Phone is not required because the Twilio call log can arrive without phone data.
      phone: {
        type: String,
        required: false,
        default: '',
      },
    },

    startTime: {
      type: Date,
      required: false,
    },

    endTime: {
      type: Date,
      required: false,
    },

    duration: {
      type: String,
      required: false,
      default: '',
    },

    direction: {
      type: String,
      required: false,
      enum: ['incoming', 'outgoing'],
    },

    status: {
      type: String,
      required: false,
      default: '',
    },

    recordingUri: {
      type: String,
      required: false,
      default: '',
    },

    price: {
      type: String,
      required: false,
      default: '',
    },

    priceUnit: {
      type: String,
      required: false,
      default: '',
    },

    // лог из twilio webhook call status callback
    rawLog: {
      type: Object,
    },
  },

  { timestamps: {}, versionKey: false },
);

module.exports = mongoose.model('Call', callSchema);
