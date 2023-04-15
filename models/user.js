const mongoose = require('mongoose');
const validator = require('validator');

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
    minlength: 2,
    type: String,
  },
  avatar: {
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    type: String,
    required: false,
  },
});

userSchema.methods.toJSON = function () {
  const data = this.toObject();

  delete data.password;

  // eslint-disable-next-line no-underscore-dangle
  delete data.__v;

  return data;
};

module.exports = mongoose.model('user', userSchema);
