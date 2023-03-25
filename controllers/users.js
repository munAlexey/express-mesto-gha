const User = require('../models/user');
const express = require('express');

module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  await User.create({ name, about, avatar })
    .then(newUser => res.send({ data: newUser }))
    .catch(err => {
      if(err.name = "CastError") {
        res.status(400).send({ message: 'Переданы некорректные данные.' })
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию.' })
      }
    });
};

module.exports.getUsers = async (req, res) => {
  await User.find({})
    .then((users => {
      console.log(users);
      res.send({ data: users })
    }))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.patchMe = async (req, res) => {
  const myId = req.user._id;
  const { name, about } = req.body;

  await User.findByIdAndUpdate(myId, { name, about }, { new: true }).then((myInfo) => {
    if(!myInfo) {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.'})
    }
    res.status(200).send(myInfo);
  }).catch(() => {
    res.status(500).send({ message: 'Ошибка по умолчанию.' })
  })
};

module.exports.patchAvatar = async (req, res) => {
  const myId = req.user._id;
  const { avatar } = req.body;

  await User.findByIdAndUpdate(myId, { avatar }, { new: true }).then((myAvatar) => {
    if(!avatar) {
      return res.send(res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.'}))
    }
    res.send(myAvatar);
  }).catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }))
};

module.exports.getUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).orFail(() => res.send({ message: 'Пользователь по указанному _id не найден'}));
  res.send(user)
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if(err.name = "CastError") {
        res.status(400).send({ message: 'Переданы некорректные данные.' })
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию.' })
      }
    });
};