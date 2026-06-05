const Product = require('../../models/Products');

/* =========================
   GET PRODUCTS
========================= */
exports.getProducts = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;

    const limit = 8;

    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments();

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

/* =========================
   GET PRODUCT BY ID
========================= */
exports.getProductById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json(product);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};