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
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
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
    mongoUrl: 'mongodb://127.0.0.1:27017/ecommerce'
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
  next();
});

/* =========================
   ROUTE MOUNTING (ORDER MATTERS)
========================= */
app.use('/', authRoutes);
app.use('/', adminRoutes);
app.use('/', cartRoutes);
app.use('/', adminAnalyticsRoutes);

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