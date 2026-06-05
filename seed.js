const mongoose = require('mongoose');
const User = require('./models/User');

/* =========================
   DB CONNECTION
========================= */
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

/* =========================
   SEED DATA
========================= */
const users = [

  // ADMINS
  {
    name: 'Super Admin',
    email: 'admin1@test.com',
    password: 'admin123',
    role: 'admin'
  },

  {
    name: 'Store Manager',
    email: 'admin2@test.com',
    password: 'admin123',
    role: 'admin'
  },

  // CUSTOMERS
  {
    name: 'Ali Khan',
    email: 'ali@test.com',
    password: 'password123'
  },

  {
    name: 'Sara Ahmed',
    email: 'sara@test.com',
    password: 'password123'
  },

  {
    name: 'Usman Tariq',
    email: 'usman@test.com',
    password: 'password123'
  },

  {
    name: 'Fatima Noor',
    email: 'fatima@test.com',
    password: 'password123'
  }

];

/* =========================
   SEED FUNCTION
========================= */
async function seedUsers() {

  try {

    // clear old users
    await User.deleteMany();

    // create users (triggers bcrypt)
    for (const user of users) {
      await User.create(user);
    }

    console.log('Users seeded successfully');
    console.log('Passwords hashed with bcrypt');

    process.exit();

  } catch (err) {

    console.log('Seed Error:', err);
    process.exit(1);

  }
}

seedUsers();