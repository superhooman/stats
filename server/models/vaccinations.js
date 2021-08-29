const mongoose = require('mongoose');

const vaccinationsSchema = mongoose.Schema({
  title: {
    type: String,
    default: 'Безымянный',
  },
  first: {
    type: Number,
    default: 0,
  },
  full: {
    type: Number,
    default: 0,
  },
  cannot: {
    type: Number,
    default: 0,
  },
  no: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Vaccination', vaccinationsSchema);