const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');
const authToken = require('../middleware/authServer');

router.get('/users', userController.getUsers);
router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
router.get('/user/:id', userController.getUserById);
router.get('/user', authToken, userController.getUserInfor);
router.patch('/user/:id/change-active-status', userController.changeActiveStatus);
router.patch('/user/update', authToken, userController.updateUser);
router.patch('/user/:id/update', userController.updateUserById);
router.patch('/user/change-password', authToken, userController.changePassword);

module.exports = router;