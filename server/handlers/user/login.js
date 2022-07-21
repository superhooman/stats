const md5 = require('md5');
const User = require('../../models/user');
const Session = require('../../models/session');
const { sendError, errEnum } = require('../../errors');

const verify = (str1, str2) => {
  return md5(str1) === md5(str2);
}

const login = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return sendError(req, res, errEnum.WRONG_AUTH);
  }
  const valid = verify(user.password, req.body.password);
  if (!valid) {
    return sendError(req, res, errEnum.WRONG_AUTH);
  }
  const session = new Session({
    user: user._id,
  });
  req.session.user = {
    sessionId: (await session.save())._id,
    type: user.type,
    _id: user._id,
    email: user.email,
    name: user.name,
    lastName: user.lastName,
  };
  return res.json({
    success: true,
    user: req.session.user,
  });
};

module.exports = login;