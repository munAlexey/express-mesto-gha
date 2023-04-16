const { Joi, celebrate, Segments } = require('celebrate');
const { urlR } = require('../utils/constants');
const express = require('express');

const router = express.Router();

const {
  getUser, getUsers, patchMe, patchAvatar, getMe,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUser);

router.patch('/me', patchMe);

router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().pattern(urlR),
  }),
}), patchAvatar);

router.get('/me', getMe);

module.exports = router;
