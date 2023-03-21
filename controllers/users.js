const User = require('../models/user');
const express = require('express');
const router = express.Router();

module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  await User.create({ name, about, avatar })
    .then(newUser => res.send({ data: newUser }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsers = async (req, res) => {
  await User.find({})
    .then((users => {
      console.log(users);
      res.send({ data: users })
    }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  res.send(JSON.stringify(user))
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка, пользователь с таким id не найден' }));
};