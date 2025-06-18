const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/create-user', userController.createUser);
router.post('/user-login-by-phone', userController.loginByPhone);
router.get('/get-all-users', userController.getAllUsers);
router.get('/get-user-by-id/:id', userController.getUserById);
router.put('/update-by-user-id/:id', userController.updateUser);
router.delete('/delete-user/:id', userController.deleteUser);

module.exports = router;