const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],

  totalPrice: Number,

  status: {
    type: String,
    enum: ['Placed','Processing','Shipped','Delivered','Cancelled'],
    default: 'Placed'
  }

  ,
  isGuest: {
    type: Boolean,
    default: false
  }

  ,
  // Optional shipping address for guest checkouts
  shippingAddress: {
    fullName: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    phone: String,
    email: String
  }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);