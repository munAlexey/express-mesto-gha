const express = require('express');
const mongoose = require('mongoose');
const user = require('./models/user')

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(()=> {
  console.log('reer');
}).catch(error => {
  console.log(error)
});

app.use()

app.listen(PORT, () => {
  console.log(`this is port ${PORT}`)
})