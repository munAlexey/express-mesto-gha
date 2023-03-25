const express = require('express');

const router = express.Router();

const {
  deleteCard, createCard, getCards, addLike, removeLike,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', addLike);

router.delete('/:cardId/likes', removeLike);

module.exports = router;
