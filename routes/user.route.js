// user.route.js
const express = require('express');
const UserController = require('../controllers/user.controller');

const router = express.Router();

// POST /user/login
router.post('/login', UserController.login);

module.exports = router;
