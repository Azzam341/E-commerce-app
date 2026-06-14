const mongoose = require('mongoose');
// Fallback manual slugifier function if you don't want to use npm install slugify
const slugify = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce'; // use app DB by default (or set via env)

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true }, // Added to match your actual database index settings
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true, enum: ['Electronics', 'Fashion', 'Home'] },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

const sampleProducts = [
  // --- ELECTRONICS (9 Items) ---
  {
    name: "Wireless Noise-Canceling Headphones",
    description: "Premium over-ear headphones with active noise canceling and 30-hour battery life.",
    price: 35000,
    category: "Electronics",
    stock: 15,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical keyboard with tactile blue switches and aluminum frame.",
    price: 12500,
    category: "Electronics",
    stock: 22,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80"
  },
  {
    name: "Ergonomic Wireless Mouse",
    description: "High-precision wireless mouse with customizable side buttons and comfortable thumb rest.",
    price: 6800,
    category: "Electronics",
    stock: 40,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80"
  },
  {
    name: "4K Ultra HD Smart Action Camera",
    description: "Waterproof sports action camera with wide-angle lens and electronic image stabilization.",
    price: 24000,
    category: "Electronics",
    stock: 8,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80"
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "IPX7 waterproof portable speaker with rich bass and 12 hours of continuous playback.",
    price: 8500,
    category: "Electronics",
    stock: 35,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80"
  },
  {
    name: "Smart Fitness Watch v2",
    description: "Tracks heart rate, sleep metrics, steps, and features a built-in GPS layout tracker.",
    price: 15900,
    category: "Electronics",
    stock: 18,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80"
  },
  {
    name: "Dual-Port Fast Wall Charger",
    description: "65W GaN fast wall charger with Type-C and USB-A output ports.",
    price: 3900,
    category: "Electronics",
    stock: 100,
    image: "https://images.unsplash.com/photo-1619134177531-df13b288e04b?w=500&q=80"
  },
  {
    name: "1080p Streaming Webcam",
    description: "Full HD desktop webcam with ring light control and built-in noise-reducing mic.",
    price: 7500,
    category: "Electronics",
    stock: 14,
    image: "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=500&q=80"
  },
  {
    name: "10000mAh Slim Power Bank",
    description: "Ultra-compact external battery pack supporting dual fast charging standard layouts.",
    price: 4200,
    category: "Electronics",
    stock: 60,
    image: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&q=80"
  },

  // --- FASHION (8 Items) ---
  {
    name: "Classic Denim Jacket",
    description: "Timeless vintage blue denim jacket featuring standard button enclosures.",
    price: 5500,
    category: "Fashion",
    stock: 25,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80"
  },
  {
    name: "Minimalist Leather Watch",
    description: "Elegant quartz watch featuring a genuine brown leather strap and simple white dial faces.",
    price: 18500,
    category: "Fashion",
    stock: 12,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
  },
  {
    name: "Lightweight Running Sneakers",
    description: "Breathable mesh running shoes with impact-absorbent cushioned foam outsoles.",
    price: 9800,
    category: "Fashion",
    stock: 30,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"
  },
  {
    name: "Polarized Retro Sunglasses",
    description: "UV400 protection polarized lenses with sleek black acetate frames.",
    price: 2900,
    category: "Fashion",
    stock: 50,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80"
  },
  {
    name: "Canvas Everyday Backpack",
    description: "Durable canvas travel backpack with laptop compartment storage up to 15 inches.",
    price: 4800,
    category: "Fashion",
    stock: 45,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
  },
  {
    name: "Premium Cotton Hoodie",
    description: "Super soft fleece-lined pullover hoodie with adjustable drawstring toggles.",
    price: 3800,
    category: "Fashion",
    stock: 40,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80"
  },
  {
    name: "Genuine Leather Wallet",
    description: "Bifold leather wallet containing 6 card slots, coin compartment, and RFID blocking layer.",
    price: 3400,
    category: "Fashion",
    stock: 75,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80"
  },
  {
    name: "Stainless Steel Chain Necklace",
    description: "Hypoallergenic cuban link necklace finished in high-polish metallic silver styling.",
    price: 1900,
    category: "Fashion",
    stock: 90,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80"
  },

  // --- HOME (8 Items) ---
  {
    name: "Aromatic Essential Oil Diffuser",
    description: "Ultrasonic cool-mist aroma humidifier featuring built-in 7 LED ambiance color options.",
    price: 4500,
    category: "Home",
    stock: 20,
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=500&q=80"
  },
  {
    name: "Stainless Steel Vacuum Flask",
    description: "Double-walled thermal insulation bottle keeping drinks hot for 12 hours or cold for 24 hours.",
    price: 2800,
    category: "Home",
    stock: 80,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80"
  },
  {
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 artisan handcrafted matte-finish stoneware ceramic coffee mugs.",
    price: 3200,
    category: "Home",
    stock: 15,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80"
  },
  {
    name: "Non-Stick Frying Pan (10-inch)",
    description: "Heavy-duty forged aluminum frying skillet complete with heat-resistant handle grip panels.",
    price: 5900,
    category: "Home",
    stock: 25,
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&q=80"
  },
  {
    name: "Memory Foam Sleep Pillow",
    description: "Ergonomic contour design therapeutic neck pillow with washable cover mesh panels.",
    price: 4900,
    category: "Home",
    stock: 30,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&q=80"
  },
  {
    name: "Desk Organizer Stand",
    description: "Natural organic bamboo wood desktop stationary assembly tier racks.",
    price: 2600,
    category: "Home",
    stock: 45,
    image: "https://images.unsplash.com/photo-1593085260707-5377ba340467?w=500&q=80"
  },
  {
    name: "Dimmable Bedside Desk Lamp",
    description: "Minimalist fabric shade desk lamp supporting 3 distinct warm touch-control brightness steps.",
    price: 6400,
    category: "Home",
    stock: 16,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80"
  },
  {
    name: "Abstract Canvas Wall Art",
    description: "Modern geometric triptych prints framed over premium wooden panels.",
    price: 7800,
    category: "Home",
    stock: 10,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully.');

    // Wipe out current products
    await Product.deleteMany({});
    console.log('Cleared existing products collections.');

    // Dynamically inject a valid string slug into every single item configuration model
    const processedProducts = sampleProducts.map(product => ({
      ...product,
      slug: slugify(product.name)
    }));

    // Insert new data collection structures
    await Product.insertMany(processedProducts);
    console.log('Successfully seeded 25 items with valid slugs into the database.');

    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding process encountered an issue:', error);
    mongoose.connection.close();
  }
}

seedDatabase();