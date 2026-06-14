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

    const successMessage = req.session.successMessage || null;
    delete req.session.successMessage;

    res.render('admin/dashboard', {
      products,
      successMessage
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

    req.session.successMessage = 'Product added successfully!';
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

    /* TOP PRODUCTS (lookup into Products to get canonical name/image) */
    const topProducts =
      await Order.aggregate([
        { $unwind: "$items" },

        {
          $group: {
            _id: "$items.productId",
            name: { $first: "$items.name" },
            totalSold: { $sum: "$items.quantity" }
          }
        },

        { $sort: { totalSold: -1 } },
        { $limit: 5 },

        // Lookup product documents by comparing stringified _id
        {
          $lookup: {
            from: "products",
            let: { pid: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: [ { $toString: "$_id" }, "$$pid" ] } } },
              { $project: { name: 1, image: 1 } }
            ],
            as: "productInfo"
          }
        },

        {
          $addFields: {
            product: { $arrayElemAt: ["$productInfo", 0] },
            displayName: { $ifNull: [ { $arrayElemAt: ["$productInfo.name", 0] }, "$name" ] },
            image: { $arrayElemAt: ["$productInfo.image", 0] }
          }
        },

        { $project: { productInfo: 0, product: 0 } }
      ]);

    /* RECENT ORDERS */
    const q = (req.query.q || '').trim();

    // fetch recent orders and populate user info (show all orders)
    let recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    // If search query provided, filter by exact order id or exact email (case-insensitive)
    if (q) {
      const qLower = q.toLowerCase();

      recentOrders = recentOrders.filter(order => {
        const idMatch = order._id.toString().toLowerCase() === qLower;

        const userEmail = (order.user?.email || '').toLowerCase();
        const guestEmail = (order.shippingAddress?.email || '').toLowerCase();

        const emailMatch = userEmail === qLower || guestEmail === qLower;

        return idMatch || emailMatch;
      });
    }

    res.render('admin/analyticsDashboard', {
      totalOrders,
      totalRevenue,
      topProducts,
      recentOrders,
      q
    });

  } catch (err) {

    console.log(err);

    res.status(500).send('Server Error');

  }
};

/* =========================
   CHANGE ORDER STATUS
========================= */
exports.changeOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    // Validate allowed statuses
    const allowed = ['Placed','Processing','Shipped','Delivered','Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).send('Invalid status');
    }

    await Order.findByIdAndUpdate(orderId, { status });

    res.redirect('/admin/analytics');
  } catch (err) {
    console.log('STATUS UPDATE ERROR:', err);
    res.status(500).send('Server Error');
  }
};