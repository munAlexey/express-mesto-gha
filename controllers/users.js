const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/constants');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-errors');
const BadRequestError = require('../errors/bad-request');
const Unauthorized = require('../errors/unauthorized');
const ErrorConflict = require('../errors/error-conflict');

module.exports.getMe = async (req, res, next) => {
  await User.findById(req.user._id).then((user) => {
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    res.send(user);
  }).catch((err) => {
    next(err);
  });
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  await bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((newUser) => {
        res.send({ data: newUser.toJSON() });
      })
      .catch((err) => {
        if ((err.name === 'ValidationError')) {
          next(new BadRequestError('Переданы некорректные данные.'));
        } else if ((err.code === 11000)) {
          next(new ErrorConflict('Данный email уже зарегистрирован'));
        } else {
          next(err);
        }
      });
  });
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password').orFail(() => {
    throw new Unauthorized('Invalid email or password');
  }).then(async (user) => {
    const matched = await bcrypt.compare(password, user.password);

    if (matched) {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY);
      res.cookie('jwt', token, {
        maxAge: 3600,
        httpOnly: true,
      }).send(user.toJSON());
    } else {
      throw new Unauthorized('Invalid email or password');
    }
  })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUsers = async (req, res, next) => {
  await User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.patchMe = async (req, res, next) => {
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
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

module.exports.patchAvatar = async (req, res, next) => {
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
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

module.exports.getUser = async (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    next(new BadRequestError('Переданы некорректные данные.'));
  }

  await User.findById(userId).orFail(() => {
    throw new NotFoundError('Пользователь по указанному _id не найден');
  }).then((userData) => res.send({ data: userData }))
    .catch((err) => {
      next(err);
    });
};
