const Product = require('../models/Products');
const Order = require('../models/Order');

/* =========================
   VIEW CART
========================= */
const viewCart = (req, res) => {

  const cart = req.session.cart || [];

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  res.render('cart', { cart, total });
};

/* =========================
   ADD TO CART
========================= */
const addToCart = async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (!product) return res.redirect('/');

  if (!req.session.cart) req.session.cart = [];

  const existing = req.session.cart.find(
    item => item.productId === product._id.toString()
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    req.session.cart.push({
      productId: product._id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  res.redirect('/cart');
};

/* =========================
   REMOVE ITEM
========================= */
const removeFromCart = (req, res) => {

  req.session.cart =
    (req.session.cart || []).filter(
      item => item.productId !== req.params.id
    );

  res.redirect('/cart');
};

/* =========================
   INCREASE QTY
========================= */
const increaseQty = (req, res) => {

  const item = (req.session.cart || [])
    .find(i => i.productId === req.params.id);

  if (item) item.quantity += 1;

  res.redirect('/cart');
};

/* =========================
   DECREASE QTY
========================= */
const decreaseQty = (req, res) => {

  const cart = req.session.cart || [];

  const item = cart.find(
    i => i.productId === req.params.id
  );

  if (item) {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      req.session.cart = cart.filter(
        i => i.productId !== req.params.id
      );
    }
  }

  res.redirect('/cart');
};

/* =========================
   CHECKOUT (SAVE ORDER)
========================= */
const checkout = async (req, res) => {

  try {

    const cart = req.session.cart || [];

    if (cart.length === 0) {
      return res.redirect('/cart');
    }

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // SAVE ORDER TO DATABASE
    await Order.create({
      user: req.session.user?.id || null,
      items: cart,
      totalPrice: total
    });

    // CLEAR CART
    req.session.cart = [];

    req.session.successMessage =
      "Checkout successful 🎉";

    res.redirect('/');

  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

/* =========================
   EXPORT ALL FUNCTIONS
========================= */
module.exports = {
  viewCart,
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  checkout
}; 