require("dotenv").config();
const mongoose = require('mongoose');

async function connect() {
    try {
        mongoose.set("strictQuery", true);

        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3dmea9y.mongodb.net/`
        );

        console.log("Successfully connected to database!");
    } catch (error) {
        console.error("Error connecting to database: ", error)
    }
}

module.exports = { connect };