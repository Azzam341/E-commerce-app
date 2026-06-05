const express = require('express');
const router = express.Router();

const cartController =
  require('../controllers/cartController');

/* VIEW CART */
router.get('/cart', cartController.viewCart);

/* ADD */
router.get('/cart/add/:id', cartController.addToCart);

/* REMOVE */
router.get('/cart/remove/:id', cartController.removeFromCart);

/* INCREASE */
router.get('/cart/increase/:id', cartController.increaseQty);

/* DECREASE */
router.get('/cart/decrease/:id', cartController.decreaseQty);

/* CHECKOUT */
router.post('/cart/checkout', cartController.checkout);

module.exports = router;