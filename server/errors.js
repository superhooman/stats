const debug = require('debug');

const log = debug('errors');

const errors = {
  NO_IMAGE: {
    error: 'request.image',
    code: 400,
  },
  WRONG_SESSION: {
    error: 'request.session.wrong',
    code: 403,
  },
  EMAIL_EXISTS: {
    error: 'request.email.exists',
    code: 409,
  },
  WRONG_AUTH: {
    error: 'request.auth',
    code: 400,
  },
  DEFAULT: {
    error: 'server.default',
    code: 500,
  },
  FORM_ERROR: {
    error: 'request.form',
    code: 400,
  },
  FORM_EXTRA: {
    error: 'request.form.extra',
    code: 400,
  },
  NO_ID: {
    error: 'request.id',
    code: 400,
  },
  WRONG_ID: {
    error: 'request.id.wrong',
    code: 400,
  },
  NOT_AN_IMAGE: {
    error: 'request.image.format',
    code: 400,
  },
  FORBIDDEN: {
    error: 'server.forbidden',
    code: 403,
  },
  UPLOAD_ERROR: {
    error: 'server.upload',
    code: 500,
  },
  NO_USER: {
    error: 'request.email.noMatch',
    code: 409,
  },
  INVALID_FORGOT_TOKEN: {
    error: 'request.forgotToken',
    code: 409,
  },
  NOT_STARTED: {
    error: 'test.notStarted',
    code: 400,
  },
  ALREADY_ANSWERED: {
    error: 'test.answered',
    code: 400,
  },
  TIMEOUT: {
    error: 'test.timeout',
    code: 400,
  },
  NO_FILE: {
    error: 'request.file',
    code: 400,
  },
  NOT_A_FILE: {
    error: 'request.file.format',
    code: 400,
  },
};

const errEnum = {
  NO_IMAGE: 'NO_IMAGE',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  WRONG_AUTH: 'WRONG_AUTH',
  DEFAULT: 'DEFAULT',
  FORM_ERROR: 'FORM_ERROR',
  NO_ID: 'NO_ID',
  WRONG_ID: 'WRONG_ID',
  NOT_AN_IMAGE: 'NOT_AN_IMAGE',
  FORBIDDEN: 'FORBIDDEN',
  UPLOAD_ERROR: 'UPLOAD_ERROR',
  NO_USER: 'NO_USER',
  INVALID_FORGOT_TOKEN: 'INVALID_FORGOT_TOKEN',
  WRONG_SESSION: 'WRONG_SESSION',
  FORM_EXTRA: 'FORM_EXTRA',
  NOT_STARTED: 'NOT_STARTED',
  ALREADY_ANSWERED: 'ALREADY_ANSWERED',
  TIMEOUT: 'TIMEOUT',
  NO_FILE: 'NO_FILE',
  NOT_A_FILE: 'NOT_A_FILE',
};

const sendError = (req, res, error = 'default', data = {}) => {
  log(`${(new Date()).getTime()} Error logged:`, req.method, req.path, error);
  const err = errors[error] || errors.DEFAULT;
  res.status(err.code).json({
    ...err,
    ...data,
    success: false,
  });
};

module.exports = {
  errors,
  errEnum,
  sendError,
};