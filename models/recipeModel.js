const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A recipe must have a name"]
    },
    category: {
        type: String,
        required: [true, "A recipe must have a category"]
    },
    origin: String,
    description: {
        type: String,
        maxlength: 300
    },
    ingredients: {
        type: Array,
        required: [true, "A recipe must have a list of ingedients"]
    },
    preparation: {
        type: Array,
        required: [true, "A recipe must have a list of step-by-step preparation process"]
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;

