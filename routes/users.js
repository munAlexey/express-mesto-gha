const express = require('express');
const router = express.Router();

const { createUser, getUser, getUsers, patchMe, patchAvatar } = require('../controllers/users');

const users = [];

router.get('/', getUsers);

router.post('/', createUser);

router.get('/:userId', getUser);

router.patch('/me', patchMe);

router.patch('/me/avatar', patchAvatar);

module.exports = router;