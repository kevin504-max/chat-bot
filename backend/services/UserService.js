const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { Message } = require('../models/Message');

module.exports = class UserService {
    constructor () {}

    registerUser = async (params) => {
        const { username, email, password, confirmPassword } = params;

        // Validations
        if (!username) {
            return { status: 422, message: "Please enter a username!" };
        }

        if (!email) {
            return { status: 422, message: "Please enter an email!" };
        }

        if (!password) {
            return { status: 422, message: "Please enter a password!" };
        }

        if (password !== confirmPassword) {
            return { status: 422, message: "Passwords do not match!" };
        }

        // Check if user already exists
        const userExists = await User.findOne({ email: email });

        if (userExists) {
            return { status: 422, message: "User already exists!" };
        }

        // Create password
        const salt = await bcryptjs.genSalt(12);
        const passwordHash = await bcryptjs.hash(password, salt);

        // Create user
        const newUser = new User({
            username,
            email,
            passwordHash: passwordHash
        });

        try {
            await newUser.save();

            const secret = process.env.JWT_SECRET;
            const token = jwt.sign({ id: newUser._id }, secret);

            return { status: 201, message: "User created successfully!", token: token };            
        } catch (error) {
            console.error('UserService::registerUser ', error);
            throw `Error ${error}`;
        }
    }

    loginUser = async (params) => {
        const { email, password } = params;

        if (!email) {
            return { status: 422, message: "Please enter an email!" };
        }

        if (!password) {
            return { status: 422, message: "Please enter a password!" };
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return { status: 404, message: "User not found!" };
        }

        const checkPassword = await bcryptjs.compare(password, user.passwordHash);  

        if (! checkPassword) {
            return { status: 401, message: "Invalid credentials!" };
        }

        try {
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign({ id: user._id }, secret);

            return { status: 200, message: "User logged in successfully!", token: token };            
        } catch (error) {
            console.error('UserService::loginUser ', error);
            throw `Error ${error}`;
        }
    }
    
    getUsers = async () => {
        try {
            return await User.find();
        } catch (error) {
            console.error('UserService::getUsers ', error);
            throw `Error ${error}`;
        }
    }

    findUser = async (userId) => {
        try {
            return await User.findOne({ _id: userId });
        } catch (error) {
            console.error('UserService::findUser ', error);
            throw `Error ${error}`;
        }
    }

    getUserMessages = async (userId) => {
        try {
            // Get all messages sent to or from the user
            const userMessages = await Message.find({ $or: [{ sendTo: userId }, { username: userId }] });

            // Sort the messages by date
            userMessages.sort((a, b) => a.date - b.date);
            
            return userMessages;
        } catch (error) {
            console.error('UserService::getUserMessages ', error);
            throw `Error ${error}`;
        }
    }
}