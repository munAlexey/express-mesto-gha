const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { createUser, getUser, getUsers } = require('../controllers/users');

const users = [];

router.get('/', getUsers);

router.post('/', createUser);

router.get('/:userId', getUser);

// router.delete('/:userId', async (req, res) => {
//   const { userId } = req.params;
//   User.findOneAndDelete(userId).orFail(() => {
//     res.status(404);
//     res.send('user not found')
//   }).then(result => {
//     res.send(result)
//   });
// });

// router.patch('/:userId', async (req, res) => {
//   const { userId } = req.params;
//   const { name, about, avatar } = req.body
//   await User.findOneAndUpdate(userId, { name, about, avatar }, { new: true }).then(user => {
//     res.send(user);
//   })
//   res.send('user updated')
// });

module.exports = router;