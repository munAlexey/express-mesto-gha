const Card = require('../models/card');
const {
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../utils/constants');
const NotFoundError = require('../errors/not-found-errors');

module.exports.getCards = async (req, res) => {
  Card.find({}).populate(['owner', 'likes'])
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.createCard = async (req, res) => {
  const { name, link, ownerId } = req.body;

  await Card.create({ name, link, owner: ownerId })
    .then((newCard) => {
      res.send({ data: newCard });
    })
    .catch((err) => {
      if ((err.name === 'ValidationError')) {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.deleteCard = async (req, res) => {
  const userId = req.user._id;
  const card = req.params.cardId;

  Card.findById(card)
    .then((foundCard) => {
      Card.findByIdAndDelete(foundCard)
        .orFail(() => {
          throw new NotFoundError('NotFound');
        })
        .then((result) => {
          if (card.card !== userId) {
            res.send(result);
          }
        }).catch((err) => {
          if (err.message === 'NotFound') {
            res.status(ERROR_NOT_FOUND).send({
              message:
                'Карточка или пользователь не найден или был запрошен несуществующий роут.',
            });
          } else if (err.name === 'CastError') {
            res
              .status(ERROR_INCORRECT_DATA)
              .send({ message: 'Переданы некорректные данные.' });
          } else { res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' }); }
        });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({
          message:
            'Карточка или пользователь не найден или был запрошен несуществующий роут.',
        });
      } else if (err.name === 'CastError') {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные.' });
      } else { res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' }); }
    });
};

module.exports.addLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new NotFoundError('NotFound');
  }).populate('owner')
  .then(() => res.send({ message: 'Вы поставили лайк' }))
  .catch((err) => {
    if (err.message === 'NotFound') {
      res.status(ERROR_NOT_FOUND).send({
        message:
            'Карточка или пользователь не найден или был запрошен несуществующий роут.',
      });
    } else if ((err.name === 'CastError')) {
      res.status(ERROR_INCORRECT_DATA).send({
        message: 'Переданы некорректные данные для постановки/снятии лайка.',
      });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    }
  });

module.exports.removeLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new NotFoundError('NotFound');
  }).populate('owner')
  .then(() => res.send({ message: 'Вы удалили лайк' }))
  .catch((err) => {
    if (err.message === 'NotFound') {
      res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Передан несуществующий _id карточки.' });
    } else if ((err.name === 'CastError')) {
      res.status(ERROR_INCORRECT_DATA).send({
        message: 'Переданы некорректные данные для постановки/снятии лайка.',
      });
    } else {
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    }
  });
