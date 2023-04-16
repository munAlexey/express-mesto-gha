const { Joi, celebrate, Segments } = require('celebrate');
const express = require('express');

const router = express.Router();

const {
  createUser, login,
} = require('../controllers/users');

router.post('/signup', celebrate({
  [Segments.BODY]: {
    name: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    about: Joi.string(),
    avatar: Joi.string(),
  },
}), createUser);

router.post('/signin', login);

module.exports = router;
