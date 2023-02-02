const mongoose = require("mongoose");

const DB = process.env.MONGO_URI

mongoose.set('strictQuery', false);
const connectDB = ()=> {
    mongoose.connect(DB, {
        useNewUrlParser: true,
    }).then(
        (conn) => {console.log(`MongoDB Connected: ${conn.connection.host}`)}
    )
};

module.exports = connectDB;