const express = require('express');
const { getUsers, getMe } = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', getUsers);
router.get('/me', getMe);

module.exports = router;
