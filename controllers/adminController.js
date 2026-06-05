const Product = require('../models/Products');
const Order = require('../models/Order');

/* =========================
   ADMIN DASHBOARD (PRODUCTS)
========================= */
exports.getDashboard = async (req, res) => {
  try {

    const products =
      await Product.find()
        .sort({ createdAt: -1 });

    res.render('admin/dashboard', {
      products
    });

  } catch (err) {

    console.log(err);
    res.status(500).send('Server Error');

  }
};

/* =========================
   ADD PRODUCT PAGE
========================= */
exports.getAddProductPage = (req, res) => {
  res.render('admin/add_product');
};

/* =========================
   CREATE PRODUCT
========================= */
exports.createProduct = async (req, res) => {
  try {

    const {
      name,
      description,
      price,
      category,
      stock
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).send('Required fields missing');
    }

    await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: req.file
        ? '/uploads/' + req.file.filename
        : '/uploads/default.png'
    });

    res.redirect('/admin');

  } catch (err) {

    console.log('CREATE ERROR:', err);
    res.status(500).send(err.message);

  }
};

/* =========================
   EDIT PRODUCT PAGE
========================= */
exports.getEditProductPage = async (req, res) => {
  try {

    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.render('admin/edit_product', {
      product
    });

  } catch (err) {

    console.log(err);
    res.status(500).send('Server Error');

  }
};

/* =========================
   UPDATE PRODUCT
========================= */
exports.updateProduct = async (req, res) => {
  try {

    const {
      name,
      description,
      price,
      category,
      stock
    } = req.body;

    let updateData = {
      name,
      description,
      price,
      category,
      stock
    };

    if (req.file) {
      updateData.image =
        '/uploads/' + req.file.filename;
    }

    await Product.findByIdAndUpdate(
      req.params.id,
      updateData
    );

    res.redirect('/admin');

  } catch (err) {

    console.log('UPDATE ERROR:', err);
    res.status(500).send(err.message);

  }
};

/* =========================
   DELETE PRODUCT
========================= */
exports.deleteProduct = async (req, res) => {
  try {

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.redirect('/admin');

  } catch (err) {

    console.log('DELETE ERROR:', err);
    res.status(500).send('Server Error');

  }
};

/* =========================
   ADMIN ANALYTICS PAGE
   (THIS FIXES /admin/analytics)
========================= */
exports.getAnalytics = async (req, res) => {

  try {

    /* TOTAL ORDERS */
    const totalOrders =
      await Order.countDocuments();

    /* TOTAL REVENUE */
    const revenueResult =
      await Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalPrice"
            }
          }
        }
      ]);

    const totalRevenue =
      revenueResult[0]?.totalRevenue || 0;

    /* TOP PRODUCTS */
    const topProducts =
      await Order.aggregate([
        { $unwind: "$items" },

        {
          $group: {
            _id: "$items.product",
            name: { $first: "$items.name" },
            totalSold: {
              $sum: "$items.quantity"
            }
          }
        },

        { $sort: { totalSold: -1 } },
        { $limit: 5 }
      ]);

    /* RECENT ORDERS */
    const recentOrders =
      await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email');

    res.render('admin/analyticsDashboard', {
      totalOrders,
      totalRevenue,
      topProducts,
      recentOrders
    });

  } catch (err) {

    console.log(err);

    res.status(500).send('Server Error');

  }
};