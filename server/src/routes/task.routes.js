const express = require('express');
const { createTask, getTasks, updateTaskStatus } = require('../controllers/task.controller');
const { authMiddleware, authorize } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', authorize('CEO', 'MANAGER'), createTask);
router.patch('/:id/status', updateTaskStatus);

module.exports = router;
