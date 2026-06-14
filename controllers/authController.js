const User = require('../models/User');

/* =========================
   REGISTER PAGE
========================= */
exports.getRegisterPage = (req, res) => {
  res.render('auth/register');
};

/* =========================
   REGISTER USER
========================= */
exports.registerUser = async (req, res) => {

  const {
    name,
    email,
    password
  } = req.body;

  try {

    await User.create({
      name,
      email,
      password
    });

    res.redirect('/login');

  } catch (err) {

    res.send(err.message);

  }
};

/* =========================
   LOGIN PAGE
========================= */
exports.getLoginPage = (req, res) => {
  res.render('auth/login');
};

/* =========================
   LOGIN USER
========================= */
exports.loginUser = async (req, res) => {

  const {
    email,
    password
  } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.send('User not found');
    }

    const isMatch =
      await user.matchPassword(password);

    if (!isMatch) {
      return res.send('Invalid credentials');
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    /* ROLE BASED REDIRECT */
    if (user.role === 'admin') {
      return res.redirect('/admin');
    }

    return res.redirect('/');

  } catch (err) {

    res.send(err.message);

  }
};

/* =========================
   LOGOUT
========================= */
exports.logoutUser = (req, res) => {

  req.session.destroy(() => {
    res.redirect('/');
  });

};