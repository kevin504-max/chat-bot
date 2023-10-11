const mongoose = require("mongoose");

const User = mongoose.model("User", {
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        validate(value) {
            if (!value.includes("@")) {
                throw new Error("Email is invalid!");
            }
        }
    },
    passwordHash: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    }, 
});

module.exports = User;