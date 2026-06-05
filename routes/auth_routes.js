const express = require('express');

const router = express.Router();

const authController =
  require('../controllers/authController');

/* REGISTER PAGE */
router.get(
  '/register',
  authController.getRegisterPage
);

/* REGISTER */
router.post(
  '/register',
  authController.registerUser
);

/* LOGIN PAGE */
router.get(
  '/login',
  authController.getLoginPage
);

/* LOGIN */
router.post(
  '/login',
  authController.loginUser
);

/* LOGOUT */
router.get(
  '/logout',
  authController.logoutUser
);

module.exports = router;