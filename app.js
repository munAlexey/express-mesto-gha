const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const { authorization } = require('./middlewares/authorization');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  ERROR_DEFAULT,
} = require('./utils/constants');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const authRouter = require('./routes/auth');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('start');
}).catch((res) => {
  res.status(ERROR_DEFAULT).send({ message: 'Unauthorized' });
});

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger);

app.use('/auth', authRouter);
app.use(authorization);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req, res) => {
  res.send(new Error('Роутер не найден'));
});

app.use(errorLogger);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`this is port ${PORT}`);
});
