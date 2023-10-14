const { UserService } = require('../services');
const userService = new UserService();

module.exports = class UserController {
    registerUser = async (request, response) => {
        try {
            const { username, email, password, confirmPassword } = request.body;

            const result = await userService.registerUser({ username, email, password, confirmPassword });

            return response.status(result.status).json({ message: result.message, token: result.token, username: result.username });
        } catch (error) {
            console.error('UserController::registerUser ', error);
            response.status(500).json({ message: 'Something went wrong! Try again.' });
        }
    }

    loginUser = async (request, response) => {
        try {
            const { email, password } = request.body;
            const result = await userService.loginUser({ email, password });
    
            return response.status(result.status).json({ message: result.message, token: result.token, username: result.username });
        } catch (error) {
            console.error('UserController::loginUser ', error);
            response.status(500).json({ message: 'Something went wrong! Try again.' });
        }   
    }

    getUsers = async (request, response) => {
        try {
            const users = await userService.getUsers();

            if (! users || users.length === 0) {
                return response.status(404).json({ message: 'No users found!' });
            } else if (Object.keys(users).length === 0) {
                return response.status(204).json({ message: 'No users found!' });
            }

            return response.status(200).json({ users: users });
        } catch (error) {
            console.error('UserController::getUsers ', error);
            response.status(500).json({ message: 'Something went wrong! Try again.' });
        }
    }

    findUser = async (request, response) => {
        try {
            const user = await userService.findUser(request.params.id);

            if (! user) {
                return response.status(404).json({ message: 'User not found!' });
            } else if (Object.keys(user).length === 0) {
                return response.status(204).json({ message: 'User not found!' });
            }

            return response.status(200).json({ user: user });
        } catch (error) {
            console.error('UserController::findUser ', error);
            response.status(500).json({ message: 'Something went wrong! Try again.' });
        }
    }

    getUserMessages = async (request, response) => {
        try {
            const messages = await userService.getUserMessages(request.params.username);

            if (! messages || messages.length === 0) {
                return response.status(404).json({ message: 'No messages found!' });
            } else if (Object.keys(messages).length === 0) {
                return response.status(204).json({ message: 'No messages found!' });
            }

            return response.status(200).json({ userMessages: messages });
        } catch (error) {
            console.error('UserController::getUserMessages ', error);
            response.status(500).json({ message: 'Something went wrong! Try again.' });
        }
    }
}