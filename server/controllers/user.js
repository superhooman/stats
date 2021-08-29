const express = require('express');
const verify = require('../utils/verify');

const handlers = require('../handlers/user');

class UserController {
  constructor() {
    this.path = '/user';
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/register', handlers.register);
    this.router.post('/login', handlers.login);
    this.router.get('/me', verify, handlers.me);
  }
}

module.exports = UserController;
