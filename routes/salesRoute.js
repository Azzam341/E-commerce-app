const Order = require('../models/Order');

/* =========================
   SALES DASHBOARD (SSR)
========================= */
exports.getSalesPage = async (req, res) => {

  try {

    /* TOTAL SALES COUNT */
    const totalOrders =
      await Order.countDocuments();

    /* TOTAL REVENUE */
    const revenueData =
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
      revenueData[0]?.totalRevenue || 0;

    /* DAILY SALES (basic aggregation) */
    const salesByDay =
      await Order.aggregate([
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt"
              }
            },
            revenue: {
              $sum: "$totalPrice"
            },
            orders: {
              $sum: 1
            }
          }
        },
        { $sort: { _id: 1 } }
      ]);

    /* RENDER SSR PAGE */
    res.render('sales', {
      totalOrders,
      totalRevenue,
      salesByDay
    });

  } catch (err) {

    console.log(err);
    res.status(500).send('Server Error');

  }
};