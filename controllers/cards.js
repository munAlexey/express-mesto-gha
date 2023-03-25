const Card = require('../models/card');
const express = require('express');

module.exports.getCards = async (req, res) => {
  await Card.find({})
    .then((cards => {
      console.log(cards);
      res.send({ data: cards })
    }))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;

  await Card.create({ name, link, owner: req.user._id })
    .then(newCard => {
      console.log(newCard);
      res.send({ data: newCard });
    })
    .catch(err => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.deleteCard = async (req, res) => {
  const { cardId } = req.params.cardId;

  Card.findByIdAndDelete(cardId).orFail(() => {
    res.status(400);
    res.send('ППереданы некорректные данные при создании пользователя.')
  }).then((result) => {
    res.send(result)
  })
}

module.exports.addLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).orFail(() => {
  res.send({ message: 'Передан несуществующий _id карточки.'})
}).catch((err) => {
  if(err.name = "CastError") {
    res.status(400).send({ message: 'ереданы некорректные данные для постановки/снятии лайка.' })
  } else {
    res.status(500).send({ message: 'Ошибка по умолчанию.' })
  }
});

module.exports.removeLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).orFail(() => {
  res.send({ message: 'Передан несуществующий _id карточки.'})
}).catch((err) => {
  if(err.name = "CastError") {
    res.status(400).send({ message: 'ереданы некорректные данные для постановки/снятии лайка.' })
  } else {
    res.status(500).send({ message: 'Ошибка по умолчанию.' })
  }
});