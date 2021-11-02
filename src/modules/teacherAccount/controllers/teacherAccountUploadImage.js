const message = require('../../utils/messages');
const { get } = require('lodash');
const analytics = require('../../analytics/controllers/analytics');
const updateById = require('../queries/updateById');

const teacherAccountUploadImage = async (req, res) => {
  const teacherAccountId = get(req, 'params.teacherAccountId', '');
  const image = get(req, 'file.transforms', '');
  const originalImageUrl = image.find(({ id }) => id === 'original').location;
  const thumbnailImageUrl = image.find(({ id }) => id === 'thumbnail').location;

  const updatedTeacherAccount = await updateById({
    teacherAccountId,
    values: { image: [originalImageUrl, thumbnailImageUrl] },
  });

  if (updatedTeacherAccount.success) {
    res.status(200).json(message.success('Teacher image uploaded'));
  } else {
    const analyticsId = analytics('TEACHER_ACCOUNT_UPLOAD_IMAGE_ERROR', {
      error: updatedTeacherAccount.payload,
      body: req.body,
      entity: 'TeacherAccount',
      entityId: teacherAccountId,
      controller: 'teacherAccountUploadImage',
    });
    res.status(400).json(message.fail('Upload teacher image error', analyticsId));
  }
};

module.exports = teacherAccountUploadImage;
