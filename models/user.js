const mongoose = require('mongoose');
const validator = require('validator');
const { urlR } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Invalid email',
    },
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
  avatar: {
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    type: String,
    validate: {
      validator: (value) => urlR.test(value),
    },
    required: false,
  },
});

userSchema.methods.toJSON = function () {
  const data = this.toObject();

  delete data.password;

  delete data.__v;

  return data;
};

module.exports = mongoose.model('user', userSchema);
