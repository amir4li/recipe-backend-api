const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const connectDB = require("./config/db");
const app = require('./app');

// Connecting to Database
connectDB();


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on mode on port ${PORT}`);
});

