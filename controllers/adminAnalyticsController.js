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
        { $limit: 5 }
      ]);

    const recentOrders =
      await Order.find()
        .sort({ createdAt: -1 })
        .limit(5);

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