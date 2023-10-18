const axios = require('axios');
const baseURL = 'http://localhost:3300/api';
const baseHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

describe("API Endpoints Tests", () => {
    const userTest = {
        username: "Warren McCulloch",
        email: "warren@ia.com",
        passwordHash: "kEROhOJEdAmAMAEdOCINHOdEcOCOEMorango#()@",
        password: "test123",
        confirmPassword: "test123",
    };
    let userToExclude = ''; // Take the user ID to be excluded from the database

    // Test the /register endpoint
    it("Should register a new user in database and return a good status, a message, an username, a token and the userId", async () => {
        const { username, email, password, confirmPassword } = userTest;

        const payload = {
            username: username,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
        };

        try {
            const response = await axios.post(`${baseURL}/register`, payload, {
                headers: baseHeaders,
            });

            const { status, message, token, username, userId } = response.data;

            expect(status).toBe(201);
            expect(message).toBe("User created successfully!");
            expect(username).toBe(username);
            expect(token).toBeDefined();

            userToExclude = userId; // Take the user ID to be excluded from the database
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    });

    // Test the /login endpoint
    it("Should login a user and return a good status, a message, an username and a token", async () => {
        const { email, password } = userTest;

        const payload ={
            email: email,
            password: password,
        };

        try {
            const response = await axios.post(`${baseURL}/login`, payload, {
                headers: baseHeaders,
            });

            const { message, token, username } = response.data;

            expect(response.status).toBe(200);
            expect(message).toBe("User logged in successfully!");
            expect(username).toBe(userTest.username);
            expect(token).toBeDefined();
        } catch (error) {
            console.error('Error logging in user:', error);
            throw error;
        }
    });

    // Test the /users endpoint
    it("Should return all users in database and a good status", async () => {
        try {
            const response = await axios.get(`${baseURL}/users`, {
                headers: baseHeaders,
            });

            const { users, status } = response.data;

            expect(response.status).toBe(200);
            expect(users).toBeDefined();
        } catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    });

    // Test the /users/:id endpoint
    it("Should return a user by ID and a good status", async () => {
        try {
            const response = await axios.get(`${baseURL}/users/${userToExclude}`, {
                headers: baseHeaders,
            });

            const { user } = response.data;

            expect(response.status).toBe(200);
            expect(user).toBeDefined();
        } catch (error) {
            console.error('Error getting user by ID:', error);
            throw error;
        }
    });

    // Test the /users/:username/messages endpoint
    it("Should return all messages from a user and a good status", async () => {
        try {
            const response = await axios.get(`${baseURL}/users/${userTest.username}/messages`, {
                headers: baseHeaders,
            });

            // In that case the user has no messages, so the bot will send a default message
            const { username, message } = response.data.userMessages[0];

            expect(response.status).toBe(200);
            expect(username).toBe('Bot');
            expect(message).toBe('You must logout and start the bot in Telegram first!');
        } catch (error) {
            console.error('Error getting messages from a user:', error);
            throw error;
        }
    });

    // // Test the /users/:id endpoint (DELETE)
    it("Should delete a user by ID", async () => {
        try {
            const response = await axios.delete(`${baseURL}/users/${userToExclude}`, {
                headers: baseHeaders,
            });

            const { message } = response.data;

            expect(response.status).toBe(200);
            expect(message).toBe("User deleted successfully!");
        } catch (error) {
            console.error('Error deleting user by ID:', error);
            throw error;
        }
    });
});
