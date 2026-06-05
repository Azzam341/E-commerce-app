const express = require('express');
const router = express.Router();

/* =========================
   MIDDLEWARE
========================= */
const verifyToken =
  require('../middleware/verifyToken');

/* =========================
   CONTROLLERS
========================= */
const authController =
  require('../controllers/api/authController');

const productController =
  require('../controllers/api/productController');

const userController =
  require('../controllers/api/userController');

const orderController =
  require('../controllers/api/orderController');

const salesController =
  require('../controllers/api/salesController');

/* =========================
   AUTH
========================= */
router.post(
  '/auth/login',
  authController.login
);

/* =========================
   PRODUCTS
========================= */
router.get(
  '/products',
  productController.getProducts
);

router.get(
  '/products/:id',
  productController.getProductById
);

/* =========================
   USER (PROTECTED)
========================= */
router.get(
  '/user/profile',
  verifyToken,
  userController.getProfile
);

/* =========================
   ORDERS (PROTECTED)
========================= */
router.post(
  '/orders',
  verifyToken,
  orderController.createOrder
);

/* =========================
   LIVE SALES DATA (NEW)
========================= */
router.get(
  '/sales-data',
  salesController.getSalesData
);

module.exports = router;