const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3-transform');
const sharp = require('sharp');

const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsRegion = process.env.AWS_REGION;
const awsUserAvatarBucketName = process.env.AWS_USER_AVATAR_BUCKET_NAME;
const awsCompanyLogoBucketName = process.env.AWS_COMPANY_LOGO_BUCKET_NAME;

const types = ['image/jpeg', 'image/jpg', 'image/png'];

aws.config.update({
  secretAccessKey: awsSecretAccessKey,
  accessKeyId: awsAccessKeyId,
  region: awsRegion,
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid Mime Type, only JPEG, JPG and PNG'), false);
  }
};

const fileName = (file) => {
  const nameWithoutExtension = file.originalname.slice(
    0,
    file.originalname.lastIndexOf('.'),
  );
  const extension = file.originalname.slice(file.originalname.lastIndexOf('.')); // .png
  return `${nameWithoutExtension}-${Date.now().toString()}${extension}`;
};

const bucketName = (req, file, cb) => {
  let bucketName = null;
  if (file.fieldname === 'avatar') {
    bucketName = awsUserAvatarBucketName;
  } else if (file.fieldname === 'logo') {
    bucketName = awsCompanyLogoBucketName;
  }
  return cb(null, bucketName);
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: bucketName,
    shouldTransform: true,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    transforms: [
      {
        id: 'original',
        key: function (req, file, cb) {
          cb(null, fileName(file));
        },
        transform: function (req, file, cb) {
          cb(null, sharp().jpeg());
        },
      },
      {
        id: 'thumbnail',
        key: function (req, file, cb) {
          cb(null, 'thumbnail_' + fileName(file));
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(200, 200).jpeg());
        },
      },
    ],
  }),
});

module.exports = upload;
