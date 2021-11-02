const listRoles = ['new', 'verified', 'student', 'teacher'];

const base = [
  'base.create.own',
  'base.get.own',
  'base.search.own',
  'base.update.own',
  'base.delete.own',
];

const teacherAccount = [
  'teacherAccount.create.own',
  'teacherAccount.get.own',
  'teacherAccount.update.own',
  'teacherAccount.search.own',
  'teacherAccount.delete.own',
];

const studentAccount = [
  'studentAccount.create.own',
  'studentAccount.get.own',
  'studentAccount.search.own',
  'studentAccount.update.own',
  'studentAccount.delete.own',
];

const classType = [
  'classType.create.own',
  'classType.get.own',
  'classType.search.own',
  'classType.update.own',
  'classType.delete.own',
];

const classes = [
  'classes.create.own',
  'classes.get.own',
  'classes.search.own',
  'classes.update.own',
  'classes.delete.own',
];

const event = [
  'event.create.own',
  'event.get.own',
  'event.search.own',
  'event.update.own',
  'event.delete.own',
];

const style = [
  'style.create.own',
  'style.get.own',
  'style.search.own',
  'style.update.own',
  'style.delete.own',
];

const client = [
  'client.create.own',
  'client.get.own',
  'client.search.own',
  'client.update.own',
  'client.delete.own',
];

const message = [
  'message.send.own',
  'message.create.own',
  'message.get.own',
  'message.search.own',
  'message.update.own',
  'message.delete.own',
];

const sipPhone = [
  'sipPhone.create.own',
  'sipPhone.get.own',
  'sipPhone.search.own',
  'sipPhone.update.own',
  'sipPhone.delete.own',
  'sipPhone.generate.token',
];

const payment = [
  'payment.create.own',
  'payment.get.own',
  'payment.search.own',
  'payment.update.own',
  'payment.delete.own',
];

const userAdmin = [
  'user.auth',
  'user.delete.any',
  'user.update.any',
  'user.search',
  'user.impersonate',
  'user.stats',
];

const roles = {
  new: [
    'user.auth',
    'teacherAccount.get.own',
    'teacherAccount.search.own',
    'studentAccount.get.own',
    'studentAccount.search.own',
  ],

  verified: [
    'user.auth',
    'teacherAccount.create.own',
    'teacherAccount.get.own',
    'teacherAccount.search.own',
    'studentAccount.create.own',
    'studentAccount.get.own',
    'studentAccount.search.own',
  ],

  student: ['user.auth', 'user.search', ...studentAccount, 'teacherAccount.create.own'],

  teacher: [
    'user.auth',
    ...teacherAccount,
    ...classes,
    ...event,
    ...message,
    ...client,
    ...sipPhone,
    ...payment,
    'studentAccount.create.own',
    'classType.get.own',
    'classType.search.own',
    'style.get.own',
    'style.search.own',
    // ...address,
  ],

  admin: [
    // USER
    ...userAdmin,
    // EXAMPLE
    ...base,
    ...teacherAccount,
    'teacherAccount.delete.any',
    'teacherAccount.get.all',
    ...studentAccount,
    'studentAccount.delete.any',
    'studentAccount.get.all',
    ...classes,
    ...event,
    ...style,
    ...classType,
    ...message,
    ...client,
    ...sipPhone,
    ...payment,
  ],

  // impersonate: [
  //   // USER
  //   'user.search',
  //   'user.impersonate',
  //   'user.stats',
  // ],
};

module.exports = { listRoles, roles };
