const { sendError, errEnum } = require('../errors');
const Session = require('../models/session');

const verify = async (req, res, next) => {
  if (!req.session.user || !req.session.user.sessionId) {
    return sendError(req, res, errEnum.WRONG_SESSION);
  }
  const session = await Session.findById(req.session.user.sessionId);
  if (!session) {
    return sendError(req, res, errEnum.WRONG_SESSION);
  }
  return next();
};

module.exports = verify;
