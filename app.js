const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ERROR_DEFAULT, ERROR_NOT_FOUND } = require('./utils/constants');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('start');
}).catch((res) => {
  res.status(ERROR_DEFAULT).send({ message: 'Unauthorized' });
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64197f9c92cb82f47bbb43cc',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Роутер не найден' });
});

app.listen(PORT, () => {
  console.log(`this is port ${PORT}`);
});
