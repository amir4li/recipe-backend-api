const dotenv = require('dotenv');
const mongoose = require("mongoose");
const fs = require("fs");
const Recipe = require("./models/RecipeModel");

dotenv.config({ path: './config/config.env' });

// Connect to DB
const DB = process.env.MONGO_URI
mongoose.set('strictQuery', false);
mongoose.connect(DB, {
    useNewUrlParser: true,
}).then(
    (conn) => {console.log(`MongoDB Connected: ${conn.connection.host}`)}
);


// Read json file
const recipes = JSON.parse(fs.readFileSync(`${__dirname}/_data/recipeData.json`, "utf-8"));

// Import data into db
const importData = async ()=> {
    try {
        await Recipe.create(recipes);
        console.log("Data imported successfully...");
        process.exit();
    } catch (err) {
        console.log(err);
    };
};

// Delete data
const deleteData = async ()=> {
    try {
        await Recipe.deleteMany();
        console.log("Data Destroyed...");
        process.exit();
    } catch (err) {
        console.log(err)
    };
};

if (process.argv[2] === "-i") {
    console.log("importing...")
    importData();
} else if (process.argv[2] === "-d") {
    console.log("deleting...")
    deleteData();
};

