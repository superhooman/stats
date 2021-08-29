const argon2 = require('argon2');
const User = require('../../models/user');
const { sendError, errEnum } = require('../../errors');

const register = async (req, res) => {
  const hashedPassword = await argon2.hash(req.body.password);
  const user = new User({
    ...req.validData,
    password: hashedPassword,
  });
  try {
    return res.json({
      success: true,
      user: await user.save(),
    });
  } catch (err) {
    if (err.code === 11000) {
      return sendError(req, res, errEnum.EMAIL_EXISTS);
    }
    return sendError(req, res, errEnum.DEFAULT);
  }
};

module.exports = register;