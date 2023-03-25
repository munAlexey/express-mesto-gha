const User = require("../models/user");
const express = require("express");
const { default: mongoose, isValidObjectId } = require("mongoose");
const {
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require("../utils/constants");

module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  await User.create({ name, about, avatar })
    .then((newUser) => res.send({ data: newUser }))
    .catch((err) => {
      if ((err.name = "ValidationError")) {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: "Переданы некорректные данные." });
      } else {
        res.status(ERROR_DEFAULT).send({ message: "Ошибка по умолчанию." });
      }
    });
};

module.exports.getUsers = async (req, res) => {
  await User.find({})
    .then((users) => {
      console.log(users);
      res.send({ data: users });
    })
    .catch(() =>
      res.status(ERROR_DEFAULT).send({ message: "Ошибка по умолчанию." })
    );
};

module.exports.patchMe = async (req, res) => {
  const myId = req.user._id;
  const { name, about } = req.body;

  if (!{ name, about }) {
    return res.send(
      res.status(ERROR_INCORRECT_DATA).send({
        message: "Переданы некорректные данные при создании пользователя.",
      })
    );
  }

  await User.findByIdAndUpdate(
    myId,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((myInfo) => {
      res.send(myInfo);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_INCORRECT_DATA).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      } else {
        res.status(ERROR_DEFAULT).send({ message: "Ошибка по умолчанию." });
      }
    });
};

module.exports.patchAvatar = async (req, res) => {
  const myId = req.user._id;
  const { avatar } = req.body;

  if (!avatar) {
    return res.send(
      res.status(ERROR_INCORRECT_DATA).send({
        message: "Переданы некорректные данные при создании пользователя.",
      })
    );
  }

  await User.findByIdAndUpdate(
    myId,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((myAvatar) => {
      res.send(myAvatar);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_INCORRECT_DATA).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      } else {
        res.status(ERROR_DEFAULT).send({ message: "Ошибка по умолчанию." });
      }
    });
};

module.exports.getUser = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    res
      .status(ERROR_INCORRECT_DATA)
      .send({ message: "Переданы некорректные данные." });
  }

  const user = await User.findById(userId).orFail(() => {
    throw  new Error('NotFound');
  }
  );
  res
    .send(user)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({ message: "Пользователь по указанному _id не найден" })
      }
      res.status(ERROR_DEFAULT).send({ message: "Ошибка по умолчанию." });
    });
};
