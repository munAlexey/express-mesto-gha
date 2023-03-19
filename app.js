const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser')

const userRouter = require('./routes/users');

const app = express();
const PORT = 3005;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(()=> {
  console.log('reer');
}).catch(error => {
  console.log(error)
});

app.use(bodyParser.json())

app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log(`this is port ${PORT}`)
})