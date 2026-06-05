const jwt = require('jsonwebtoken');

const User = require('../../models/User');

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'User not found'
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN || '1h'
      }
    );

    res.json({
      message: 'Login successful',
      token
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};