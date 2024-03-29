const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const {
  PORT, MONGO_URL, REDIS_URL, COOKIE_NAME, SESSION_SECRET, PROD,
} = process.env;

const App = require('./server/app');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const session = require('express-session');

const UserController = require('./server/controllers/user');
const DataController = require('./server/controllers/data');

const app = new App({
  port: PORT,
  controllers: [
    new UserController(),
    new DataController()
  ],
  middleWares: [
    session({
      name: COOKIE_NAME,
      cookie: {
        maxAge: 1000 * 60 * 60 * 8,
        httpOnly: true,
        sameSite: 'lax',
        secure: PROD,
        domain: PROD ? DOMAIN : undefined,
      },
      saveUninitialized: false,
      secret: SESSION_SECRET,
      resave: false,
    }),
  ],
  static: [
    {
      path: '/uploads',
      folder: path.join(process.cwd(), 'uploads'),
    },
    {
      path: '/',
      folder: path.join(process.cwd(), 'public'),
    },
  ],
});

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen();