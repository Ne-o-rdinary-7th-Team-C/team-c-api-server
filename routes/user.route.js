const express = require('express');
const UserLoginController = require('../controllers/user.controller');

const router = express.Router();

router.post('/login', UserLoginController);// 로그인 

module.exports = router;
