const User = require('../models/User');
const Order = require('../models/Order');

/* =========================
   USER PROFILE PAGE
========================= */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id)
      .select('-password')
      .lean();

    if (!user) {
      return res.redirect('/login');
    }

    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .lean();

    const successMessage = req.session.profileSuccessMessage || null;
    const errorMessage = req.session.profileErrorMessage || null;

    delete req.session.profileSuccessMessage;
    delete req.session.profileErrorMessage;

    res.render('profile', {
      user,
      orders,
      successMessage,
      errorMessage
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

/* =========================
   UPDATE PROFILE
========================= */
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      street,
      city,
      state,
      zip,
      country
    } = req.body;

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.redirect('/login');
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = {
      street: street || user.address?.street || '',
      city: city || user.address?.city || '',
      state: state || user.address?.state || '',
      zip: zip || user.address?.zip || '',
      country: country || user.address?.country || ''
    };

    await user.save();

    req.session.user.name = user.name;
    req.session.user.email = user.email;

    req.session.profileSuccessMessage = 'Profile updated successfully.';
    res.redirect('/profile');
  } catch (err) {
    console.log(err);

    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      req.session.profileErrorMessage = 'This email is already registered.';
    } else {
      req.session.profileErrorMessage = err.message;
    }

    res.redirect('/profile');
  }
};
