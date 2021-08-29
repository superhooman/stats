const User = require('../../models/user');
const { sendError, errEnum } = require('../../errors');

const get = async (req, res) => {
  const user = await User.findById(req.session.user._id, {
    password: false,
  });
  if (!user) {
    req.session.destroy();
    return sendError(req, res, errEnum.FORBIDDEN);
  }
  return res.json({
    success: true,
    user,
  });
};

module.exports = get;