const express = require('express');
const { login, getUserNickname } = require('../controllers/user.controller');

const router = express.Router();

// POST /user/login
router.post('/login', login);

// GET /user
router.get('/', getUserNickname);

module.exports = router;
