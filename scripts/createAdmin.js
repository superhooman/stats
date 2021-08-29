const path = require('path');
const mongoose = require('mongoose');
const argon2 = require('argon2');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const User = require('../server/models/user');

const main = async () => {
  const users = await User.find({});
  if (users.length > 0) {
    console.log('Users exists');
    return;
  }
  const password = await argon2.hash(process.env.DEFAULT_PASSWORD);
  const user = new User({
    name: 'Админ',
    lastName: 'Админ',
    email: process.env.DEFAULT_EMAIL,
    password,
    type: User.Types.ADMIN,
  });
  console.log(await user.save());
};

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

main();
