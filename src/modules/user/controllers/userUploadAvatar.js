const message = require('../../utils/messages');
const { get } = require('lodash');
const analytics = require('../../analytics/controllers/analytics');
const updateById = require('../queries/updateById');

const userUploadAvatar = async (req, res) => {
  const userId = get(req, 'params.userId', '');
  const avatar = get(req, 'file.transforms', '');
  const originalAvatarUrl = avatar.find(({ id }) => id === 'original').location;
  const thumbnailAvatarUrl = avatar.find(({ id }) => id === 'thumbnail').location;

  const updatedUser = await updateById({
    userId,
    values: { avatar: [originalAvatarUrl, thumbnailAvatarUrl] },
  });

  if (updatedUser.success) {
    res.status(200).json(message.success('User avatar uploaded'));
  } else {
    const analyticsId = analytics('USER_UPLOAD_AVATAR_ERROR', {
      error: updatedUser.payload,
      body: req.body,
      entity: 'User',
      entityId: userId,
      user: userId,
      controller: 'userUploadAvatar',
    });
    res.status(400).json(message.fail('Upload user avatar error', analyticsId));
  }
};

module.exports = userUploadAvatar;
