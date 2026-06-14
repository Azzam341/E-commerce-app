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

  const successMessage = req.session.successMessage || null;
  const errorMessage = req.session.errorMessage || null;
  delete req.session.successMessage;
  delete req.session.errorMessage;

  res.render('cart', { cart, total, successMessage, errorMessage });
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

  const cartCount = req.session.cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({
      success: true,
      cartCount,
      message: 'Added to cart'
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

    // If guest (no logged in user) validate address fields
    let shippingAddress = null;
    if (!req.session.user) {
      const { fullName, street, city, state, zip, country, phone, email } = req.body;

      if (!fullName || !street || !city || !zip || !country) {
        req.session.errorMessage = 'Please provide full shipping address to checkout.';
        return res.redirect('/cart');
      }

      shippingAddress = { fullName, street, city, state, zip, country, phone, email };
    }
    // Validate that each cart item references an existing product
    const productIds = [...new Set(cart.map(i => i.productId))];
    const existingProducts = await Product.find({ _id: { $in: productIds } }).select('_id');
    const existingIds = existingProducts.map(p => p._id.toString());

    const missing = productIds.filter(id => !existingIds.includes(id));
    if (missing.length > 0) {
      console.warn('Checkout aborted: cart contains invalid productIds', missing);
      req.session.errorMessage = 'One or more items in your cart are no longer available. Please review your cart.';
      return res.redirect('/cart');
    }

    // SAVE ORDER TO DATABASE
    await Order.create({
      user: req.session.user?.id || null,
      items: cart,
      totalPrice: total,
      shippingAddress,
      isGuest: !req.session.user
    });

    // UPDATE PRODUCT ORDER COUNTS only for existing products
    await Promise.all(cart.map(item => {
      if (!existingIds.includes(item.productId)) return null;
      return Product.findByIdAndUpdate(item.productId, {
        $inc: { orderCount: item.quantity || 1 }
      });
    }));

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