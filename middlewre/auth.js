const express = require('express');

const router = express.Router();

const {
  createUser, login,
} = require('../controllers/users');

router.post('/signup', createUser);

router.post('/signin', login);

module.exports = router;
