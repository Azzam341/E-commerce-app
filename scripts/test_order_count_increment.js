const mongoose = require('mongoose');
const Product = require('../models/Products');
const Order = require('../models/Order');

async function run() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');

    // find mouse product by partial name
    const mouse = await Product.findOne({ name: /mouse/i });
    const pokemon = await Product.findOne({ name: /pokemon/i });

    console.log('mouse id', mouse?._id?.toString(), 'orderCount', mouse?.orderCount);
    console.log('pokemon id', pokemon?._id?.toString(), 'orderCount', pokemon?.orderCount);

    if (!mouse) { console.log('No mouse product found'); process.exit(0); }

    // create order of 30 mouse
    const newOrder = await Order.create({
      user: null,
      items: [{ productId: mouse._id.toString(), name: mouse.name, price: mouse.price, quantity: 30 }],
      totalPrice: mouse.price * 30,
      shippingAddress: { fullName: 'Tester', street: 'x', city: 'y', state: 'z', zip: '0', country: 'nowhere', phone: '0', email: 't@example.com' },
      isGuest: true
    });

    console.log('created order', newOrder._id.toString());

    // run checkout-like increment to simulate code path
    await Promise.all(newOrder.items.map(item => {
      return Product.findByIdAndUpdate(item.productId, { $inc: { orderCount: item.quantity || 1 } });
    }));

    const mouse2 = await Product.findById(mouse._id);
    const pokemon2 = pokemon ? await Product.findById(pokemon._id) : null;

    console.log('after mouse order:');
    console.log('mouse id', mouse2._id.toString(), 'orderCount', mouse2.orderCount);
    if (pokemon2) console.log('pokemon id', pokemon2._id.toString(), 'orderCount', pokemon2.orderCount);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();
