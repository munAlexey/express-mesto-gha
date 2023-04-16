const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, ERROR_UNAUTHORIZED } = require('../utils/constants');
const User = require('../models/user');
const {
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../utils/constants');

module.exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id);

  res.send(user);
};

module.exports.createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  await bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((newUser) => res.send({ data: newUser }))
      .catch((err) => {
        if ((err.name === 'ValidationError')) {
          res
            .status(ERROR_INCORRECT_DATA)
            .send({ message: 'Переданы некорректные данные.' });
        } else {
          res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
        }
      });
  });
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).orFail().then(async (user) => {
    const matched = await bcrypt.compare(password, user.password);

    if (matched) {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY);
      res.cookie('jwt', token, {
        maxAge: 3600,
        httpOnly: true,
      }).send(user.toJSON());
    } else {
      throw new Error('Invalid email or password');
    }
  }).catch(() => {
    res
      .status(ERROR_UNAUTHORIZED)
      .send('Неверная почта или пароль');
  });
};

module.exports.getUsers = async (req, res) => {
  await User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.patchMe = async (req, res) => {
  const myId = req.user._id;
  const { name, about } = req.body;

  await User.findByIdAndUpdate(
    myId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((myInfo) => {
      res.send(myInfo);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT_DATA).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.patchAvatar = async (req, res) => {
  const myId = req.user._id;
  const { avatar } = req.body;

  await User.findByIdAndUpdate(
    myId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((myAvatar) => {
      res.send(myAvatar);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT_DATA).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.getUser = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    res
      .status(ERROR_INCORRECT_DATA)
      .send({ message: 'Переданы некорректные данные.' });
    return;
  }

  await User.findById(userId).orFail(() => {
    throw new Error('NotFound');
  }).then((userData) => res.send({ data: userData }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else { res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' }); }
    });
};
