const mongoose = require('mongoose');
const Product = require('../models/Products');
const Order = require('../models/Order');

async function run() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');

    const prod = await Product.findOne();
    if (!prod) {
      console.log('NO_PRODUCT');
      process.exit(0);
    }

    const newOrder = await Order.create({
      user: null,
      items: [
        {
          productId: prod._id.toString(),
          name: prod.name,
          price: prod.price,
          quantity: 3
        }
      ],
      totalPrice: prod.price * 3,
      shippingAddress: {
        fullName: 'Test Guest',
        street: '1 Test St',
        city: 'Test',
        state: 'TS',
        zip: '00000',
        country: 'Testland',
        phone: '000',
        email: 'guest@example.com'
      },
      isGuest: true
    });

    console.log('CREATED_ORDER', newOrder._id.toString());

    const top = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          let: { pid: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: [{ $toString: '$_id' }, '$$pid'] } } },
            { $project: { name: 1, image: 1 } }
          ],
          as: 'productInfo'
        }
      },
      {
        $addFields: {
          displayName: { $ifNull: [{ $arrayElemAt: ['$productInfo.name', 0] }, '$name'] },
          image: { $arrayElemAt: ['$productInfo.image', 0] }
        }
      },
      { $project: { productInfo: 0 } }
    ]);

    console.log('TOP', JSON.stringify(top, null, 2));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();
