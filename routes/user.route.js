// user.route.js
const express = require('express');
const UserLoginController = require('../controllers/user.controller');


const router = express.Router();

// POST /user/login
router.post('/login', UserLoginController.login);


module.exports = router;
