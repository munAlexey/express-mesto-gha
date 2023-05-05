const { Joi, celebrate, Segments } = require('celebrate');
const express = require('express');
const { urlR } = require('../utils/constants');

const router = express.Router();

const {
  getUser, getUsers, patchMe, patchAvatar, getMe,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', celebrate({
  [Segments.BODY]: Joi.object().keys({
    id: Joi.string().required(),
  }),
}), getUser);

router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), patchMe);

router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().pattern(urlR).required(),
  }),
}), patchAvatar);

router.get('/me', getMe);

module.exports = router;
