const { Joi, celebrate, Segments } = require('celebrate');
const express = require('express');
const { urlR } = require('../utils/constants');

const router = express.Router();

const {
  deleteCard, createCard, getCards, addLike, removeLike,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(urlR).required(),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  [Segments.BODY]: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  [Segments.BODY]: Joi.object().keys({
    likes: Joi.string().hex().length(24).required(),
  }),
}), addLike);

router.delete('/:cardId/likes', celebrate({
  [Segments.BODY]: Joi.object().keys({
    likes: Joi.string().hex().length(24).required(),
  }),
}), removeLike);

module.exports = router;
