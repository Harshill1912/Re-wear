const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load .env
dotenv.config();

// Init app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/admin', require('./routes/admin'));


// DB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log(' MongoDB Connected');
    app.listen(process.env.PORT, () => {
      console.log(` Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(' MongoDB Error:', err));
