const express = require('express');
const router = express.Router();
const User = require('../models/user');

const users = [];

router.get('/', async (req, res) => {
  const users = await User.find({})
  res.send(users);
});

router.post('/', async (req, res) => {
  const { name, about, avatar } = req.body;

  const newUser = await User.create({ name, about, avatar });

  res.send(newUser);
});

router.get('/:userid', async (req, res) => {
  const { userId } = req.params;

  const user = await User.findOne(userId);

  res.send(user)
});

router.delete('/:userid', async (req, res) => {
  const { userId } = req.params;
  User.findOneAndDelete(userId).orFail(() => {
    res.status(404);
    res.send('user not found')
  }).then(result => {
    res.send(result)
  });
});

router.patch('/:userid', async (req, res) => {
  const { userId } = req.params;
  const { name, about, avatar } = req.body
  await User.findOneAndUpdate(userId, { name, about, avatar }, { new: true }).then(user => {
    res.send(user);
  })
  res.send('user updated')
});

module.exports = router;