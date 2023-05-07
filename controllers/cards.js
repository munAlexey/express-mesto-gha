const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-errors');
const BadRequestError = require('../errors/bad-request');

module.exports.getCards = async (req, res, next) => {
  Card.find({}).populate(['owner', 'likes'])
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => next(err));
};

module.exports.createCard = async (req, res, next) => {
  const { name, link, ownerId } = req.body;

  await Card.create({ name, link, owner: ownerId })
    .then((newCard) => {
      res.send({ data: newCard });
    })
    .catch((err) => {
      if ((err.name === 'ValidationError')) {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = async (req, res, next) => {
  const userId = req.user._id;
  const card = req.params.cardId;

  Card.findById(card)
    .then((foundCard) => {
      if (userId !== foundCard.owner.id) {
        next(new BadRequestError('Нельзя удалять чужие карточки.'));
      }
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
            next(new NotFoundError('Переданы некорректные данные.'));
          } else if (err.name === 'CastError') {
            next(new BadRequestError('Переданы некорректные данные.'));
          } else { next(err); }
        });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError('Карточка или пользователь не найден или был запрошен несуществующий роут.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else { next(err); }
    });
};

module.exports.addLike = (req, res, next) => Card.findByIdAndUpdate(
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
      next(new NotFoundError('Карточка или пользователь не найден или был запрошен несуществующий роут.'));
    } else if ((err.name === 'CastError')) {
      next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
    } else {
      next(err);
    }
  });

module.exports.removeLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new NotFoundError('NotFound');
  }).populate('owner')
  .then(() => res.send({ message: 'Вы удалили лайк' }))
  .catch((err) => {
    if ((err.name === 'CastError')) {
      next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
    } else {
      next(err);
    }
  });
