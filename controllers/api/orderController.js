/* =========================
   CREATE ORDER
========================= */
exports.createOrder = async (req, res) => {

  try {

    res.json({
      message: 'Order placed successfully',
      userId: req.user.id
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};