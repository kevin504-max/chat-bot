const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    message: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    date: {
        type: Date,
        required: true,
        trim: true,
        minlength: 1
    },
    sendTo: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
});

module.exports.Message = mongoose.model('Message', MessageSchema);