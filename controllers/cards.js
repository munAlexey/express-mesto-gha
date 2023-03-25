const Card = require("../models/card");
const express = require("express");
const {
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require("../utils/constants");

module.exports.getCards = async (req, res) => {
  await Card.find({})
    .then((cards) => {
      console.log(cards);
      res.send({ data: cards });
    })
    .catch(() =>
      res.status(ERROR_DEFAULT).send({ message: "Ошибка по умолчанию." })
    );
};

module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;

  await Card.create({ name, link, owner: req.user._id })
    .then((newCard) => {
      res.send({ data: newCard });
    })
    .catch((err) => {
      if ((err.name = "ValidationError")) {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: "Переданы некорректные данные." });
      } else {
        res.status(ERROR_DEFAULT).send({ message: "Ошибка по умолчанию." });
      }
    });
};

module.exports.deleteCard = async (req, res) => {
  const userId = req.user._id;
  const owner = req.params._id;

  Card.findById(owner)
    .then((card) => {
      Card.findByIdAndDelete(card)
        .orFail(() => {
          throw new Error("NotFound");
        })
        .then((result) => {
          if (card.owner !== userId) {
            res.send(result);
          }
        });
    })
    .catch(() => {
      if (err.message === "NotFound") {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message:
              "Карточка или пользователь не найден или был запрошен несуществующий роут.",
          });
      }
      if (err.name === "CastError") {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: "Переданы некорректные данные." });
      }
      res.status(ERROR_DEFAULT).send({ message: "Ошибка по умолчанию." });
    });
};

module.exports.addLike = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new Error("NotFound");
    })
    .then(() => res.send({ message: "Вы поставили лайк" }))
    .catch((err) => {
      if (err.message === "NotFound") {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message:
              "Карточка или пользователь не найден или был запрошен несуществующий роут.",
          });
      }
      if ((err.name = "CastError")) {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({
            message:
              "Переданы некорректные данные для постановки/снятии лайка.",
          });
      } else {
        res.status(500).send({ message: "Ошибка по умолчанию." });
      }
    });

module.exports.removeLike = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new Error("NotFound");
    })
    .then(() => res.send({ message: "Вы поставили лайк" }))
    .catch((err) => {
      if (err.message === "NotFound") {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Передан несуществующий _id карточки." });
      }
      if ((err.name = "CastError")) {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({
            message: "ереданы некорректные данные для постановки/снятии лайка.",
          });
      } else {
        res.status(ERROR_DEFAULT).send({ message: "Ошибка по умолчанию." });
      }
    });
