require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const session = require('express-session');
const MongoStore = require('connect-mongo').default;

/* =========================
   APP INIT
========================= */
const app = express();

/* =========================
   ROUTES
========================= */
const adminRoutes = require('./routes/admin_routes');
const authRoutes = require('./routes/auth_routes');
const profileRoutes = require('./routes/profileRoutes');
const apiRoutes = require('./routes/api_v1');
const cartRoutes = require('./routes/cartRoutes');
const adminAnalyticsRoutes = require('./routes/adminAnalyticsRoutes');

/* =========================
   CONTROLLERS
========================= */
const productController = require('./controllers/productController');

/* =========================
   DATABASE CONNECTION
========================= */
const dbURI = process.env.CONNECTION_STRING || 'mongodb://127.0.0.1:27017/ecommerce';

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Error:', err));

/* =========================
   VIEW ENGINE
========================= */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* =========================
   MIDDLEWARES
========================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

/* =========================
   SESSION SETUP
========================= */
app.use(session({
  secret: process.env.SESSION_SECRET || 'ecommerceSecretKey',
  resave: false,
  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: dbURI
  }),

  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

/* =========================
   GLOBAL USER (EJS ACCESS)
========================= */
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  const cart = req.session.cart || [];
  res.locals.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  next();
});

/* =========================
   ROUTE MOUNTING (ORDER MATTERS)
========================= */
app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', adminRoutes);
app.use('/', cartRoutes);
app.use('/', adminAnalyticsRoutes);

console.log('Profile route definitions:', profileRoutes.stack.map(r => r.route && r.route.path));

/* API (separate system) */
app.use('/api/v1', apiRoutes);

/* =========================
   HOME PAGE (SSR via controller)
========================= */
app.get('/', productController.getHomeProducts);

/* =========================
   404 HANDLER (OPTIONAL BUT GOOD)
========================= */
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});