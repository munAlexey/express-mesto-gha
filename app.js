const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards')

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then((req, res)=> {
  console.log('reer');
}).catch(error => {
  res.status = "500"
  res.status.send({message: "Unauthorized"})
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64197f9c92cb82f47bbb43cc'
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.listen(PORT, () => {
  console.log(`this is port ${PORT}`)
})