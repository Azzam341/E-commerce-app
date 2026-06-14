const Order = require('../models/Order');

/* =========================
   ADMIN ANALYTICS
========================= */
exports.getDashboardStats = async (req, res) => {

  try {

    const totalOrders =
      await Order.countDocuments();

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

        // lookup product details
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

    const q = (req.query.q || '').trim();

    let recentOrders =
      await Order.find()
        .sort({ createdAt: -1 })
        .populate('user', 'name email');

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