const axios = require('axios');
const baseURL = 'http://localhost:3300/api';
const baseHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

describe("API Endpoints Tests", () => {
    let userToExclude = ''; // Take the user ID to be excluded from the database

    // Test the /register endpoint
    it("Should register a new user in database and return a token", async () => {
        const userTest = {
            username: "Warren McCulloch",
            email: "warren@ia.com",
            passwordHash: "kEROhOJEdAmAMAEdOCINHOdEcOCOEMorango#()@",
        };

        const payload = {
            username: userTest.username,
            email: userTest.email,
            password: "test123",
            confirmPassword: "test123",
        };

        try {
            const response = await axios.post(`${baseURL}/register`, payload, {
                headers: baseHeaders,
            });

            const { status, message, token, username, userId } = response.data;

            expect(status).toBe(201);
            expect(message).toBe("User created successfully!");
            expect(username).toBe(userTest.username);
            expect(token).toBeDefined();

            userToExclude = userId; // Take the user ID to be excluded from the database
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    });

    // Test the /login endpoint
    it("Should login a user and return a token", async () => {
        const payload ={
            email: "warren@ia.com",
            passord: "test123"
        };

        try {
            const response = await axios.post(`${baseURL}/login`, payload, {
                headers: baseHeaders,
            });

            const { status, message, token, username } = response.data;

            expect(status).toBe(200);
            expect(message).toBe("User logged in successfully!");
            expect(username).toBe("Warren McCulloch");
            expect(token).toBeDefined();
        } catch (error) {
            console.error('Error logging in user:', error);
            throw error;
        }
    });

    // Test the /users endpoint
    it("Should return all users in database", async () => {
        try {
            const response = await axios.get(`${baseURL}/users`, {
                headers: baseHeaders,
            });

            const { users } = response.data;

            expect(response.status).toBe(200);
            expect(users).toBeDefined();
        } catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    });

    // Test the /users/:id endpoint
    it("Should return a user by ID", async () => {
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
    it("Should return all messages from a user", async () => {
        try {
            const response = await axios.get(`${baseURL}/users/Warren McCulloch/messages`, {
                headers: baseHeaders,
            });

            expect(response.status).toBe(200);
            expect(response.data.userMessages).toBeDefined();
        } catch (error) {
            console.error('Error getting messages from a user:', error);
            throw error;
        }
    });


    // Test the /:chatId/send-message endpoint
    it("Should send a message to a chat", async () => {
        const payload = {
            chatId: 123456789,
            message: "Hello, World!",
        };

        try {
            const response = await axios.post(`${baseURL}/${payload.chatId}/send-message`, payload, {
                headers: baseHeaders,
            });

            const { status, message, chatId, username, date } = response.data;

            expect(status).toBe(201);
            expect(message).toBe("Message sent successfully!");
            expect(chatId).toBe(payload.chatId);
            expect(username).toBe("Warren McCulloch");
            expect(date).toBeDefined();
        } catch (error) {
            console.error('Error sending message to a chat:', error);
            throw error;
        }
    });

    // Test the /users/:id endpoint (DELETE)
    it("Should delete a user by ID", async () => {
        try {
            const response = await axios.delete(`${baseURL}/users/${userToExclude}`, {
                headers: baseHeaders,
            });

            const { status, message } = response.data;

            expect(status).toBe(200);
            expect(message).toBe("User deleted successfully!");
        } catch (error) {
            console.error('Error deleting user by ID:', error);
            throw error;
        }
    });
});
