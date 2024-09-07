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
app.use(cors({ origin: 'https://ecommerce-app-frontend-ruby.vercel.app' }));
const connect = () => {
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

app.listen(port, () => {
    connect()
    console.log(`Server running on port ${port}`);
});

