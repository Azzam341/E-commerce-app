const express = require('express');
const router = express.Router();

const adminAnalytics =
  require('../controllers/adminAnalyticsController');

const { isAdmin } =
  require('../middleware/auth');

router.get(
  '/admin/dashboard',
  isAdmin,
  adminAnalytics.getDashboardStats
);

module.exports = router;