const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name."]
    },
    email: {
        type: String,
        required: [true, "Please provide an email."],
        unique: true,
        validate: [validator.isEmail, "Please provide a vlid email"]
    },
    role: {
        type: String,
        enum: ["user"],
        default: "user"
    },
    password: {
        type: String,
        required: [true, "Please provide a password."],
        minlength: 8,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


// Hashing password befor saving it to DB
UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    };

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Match entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model("User", UserSchema);
module.exports = User;


