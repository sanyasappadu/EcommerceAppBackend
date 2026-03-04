const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const port = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.get("/", (req,res)=>{
  res.send("hello world")
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
// app.use(cors({ origin: 'http://localhost:5173' }));
const allowedOrigins = [
  'https://ecommerce-app-frontend-ruby.vercel.app',
  'http://localhost:5173', // Vite dev
  'http://localhost:3000', // CRA dev
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));const connect = () => {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("Connected to DB");
      })
      .catch((err) => {
        throw err;
      });
  };
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/offers', require('./routes/festivalOfferRoutes'));
app.listen(port, () => {
    connect()
    console.log(`Server running on port ${port}`);
});

