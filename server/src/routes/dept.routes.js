const express = require('express');
const { createDepartment, getDepartments } = require('../controllers/dept.controller');
const { authMiddleware, authorize } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', getDepartments);
router.post('/', authorize('CEO'), createDepartment);

module.exports = router;
