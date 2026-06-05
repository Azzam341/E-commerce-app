const Product = require('../models/Products');

/* =========================
   GET PRODUCTS
========================= */
exports.getProducts = async (req, res) => {

  try {

    /* PAGINATION */
    const page =
      parseInt(req.query.page) || 1;

    const limit = 8;

    const skip = (page - 1) * limit;

    /* FILTERS */
    const search =
      req.query.search || '';

    const category =
      req.query.category || '';

    const minPrice =
      req.query.minPrice || 0;

    const maxPrice =
      req.query.maxPrice || 999999999;

    /* QUERY OBJECT */
    let query = {};

    /* SEARCH */
    if (search) {

      query.name = {
        $regex: search,
        $options: 'i'
      };

    }

    /* CATEGORY */
    if (category) {
      query.category = category;
    }

    /* PRICE RANGE */
    query.price = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice)
    };

    /* FETCH PRODUCTS */
    const products =
      await Product.find(query)
        .skip(skip)
        .limit(limit);

    /* TOTAL PRODUCTS */
    const totalProducts =
      await Product.countDocuments(query);

    /* TOTAL PAGES */
    const totalPages =
      Math.ceil(totalProducts / limit);

    res.render('products', {
      products,
      currentPage: page,
      totalPages,
      search,
      category,
      minPrice,
      maxPrice
    });

  } catch (error) {

    console.log(error);

    res.send('Server Error');

  }

};


/* =========================
   HOME PRODUCTS (EJS)
========================= */
exports.getHomeProducts = async (req, res) => {

  try {

    const page =
      parseInt(req.query.page) || 1;

    const limit = 8;

    const skip = (page - 1) * limit;

    const search =
      req.query.search || '';

    const category =
      req.query.category || '';

    const minPrice =
      Number(req.query.minPrice) || 0;

    const maxPrice =
      Number(req.query.maxPrice) || 99999;

    let query = {};

    /* SEARCH */
    if (search) {
      query.name = {
        $regex: search,
        $options: 'i'
      };
    }

    /* CATEGORY */
    if (category) {
      query.category = category;
    }

    /* PRICE RANGE */
    query.price = {
      $gte: minPrice,
      $lte: maxPrice
    };

    const products =
      await Product.find(query)
        .skip(skip)
        .limit(limit);

    const totalProducts =
      await Product.countDocuments(query);

    const totalPages =
      Math.ceil(totalProducts / limit);

    res.render('home', {
      products,
      currentPage: page,
      totalPages,
      search,
      category,
      minPrice,
      maxPrice
    });

  } catch (error) {

    console.log('Server Error:', error);

    res.status(500).send('Server Error');

  }

};