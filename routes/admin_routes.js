const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const { isAdmin } = require('../middleware/auth');

const adminController =
  require('../controllers/adminController');

/* =========================
   ADMIN DASHBOARD (PRODUCTS)
========================= */
router.get(
  '/admin',
  isAdmin,
  adminController.getDashboard
);

/* =========================
   ANALYTICS DASHBOARD
========================= */
// analytics moved to routes/adminAnalyticsRoutes.js to avoid duplicate handlers

/* =========================
   ADD PRODUCT PAGE
========================= */
router.get(
  '/admin/add',
  isAdmin,
  adminController.getAddProductPage
);

/* =========================
   CREATE PRODUCT
========================= */
router.post(
  '/admin/add',
  isAdmin,
  upload.single('image'),
  adminController.createProduct
);

/* =========================
   EDIT PRODUCT PAGE
========================= */
router.get(
  '/admin/edit/:id',
  isAdmin,
  adminController.getEditProductPage
);

/* =========================
   UPDATE PRODUCT
========================= */
router.post(
  '/admin/edit/:id',
  isAdmin,
  upload.single('image'),
  adminController.updateProduct
);

/* =========================
   DELETE PRODUCT
========================= */
router.get(
  '/admin/delete/:id',
  isAdmin,
  adminController.deleteProduct
);

/* =========================
   UPDATE ORDER STATUS
========================= */
router.post(
  '/admin/order/:id/status',
  isAdmin,
  adminController.changeOrderStatus
);

module.exports = router;