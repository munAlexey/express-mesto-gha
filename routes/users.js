const express = require('express');

const router = express.Router();

const {
  createUser, getUser, getUsers, patchMe, patchAvatar, login,
} = require('../controllers/users');

router.get('/', getUsers);

router.post('/signup', createUser);

router.post('/signin', login);

router.get('/:userId', getUser);

router.patch('/me', patchMe);

router.patch('/me/avatar', patchAvatar);

module.exports = router;
