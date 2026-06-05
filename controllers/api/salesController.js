const Order = require('../../models/Order');

/* =========================
   LIVE SALES DATA API
   GET /api/v1/sales-data
========================= */
exports.getSalesData = async (req, res) => {

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

    /* RESPONSE (STRICT JSON ONLY) */
    res.json({
      totalOrders,
      totalRevenue
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: 'Server Error'
    });

  }
};