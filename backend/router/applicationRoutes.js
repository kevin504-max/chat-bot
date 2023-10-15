const router = require('express').Router();
const UserController = require('../controllers/UserController');
const userController = new UserController();

const MessageController = require('../controllers/MessageController');
const messageController = new MessageController();

router.post('/register', (request, response) => userController.registerUser(request, response));
router.post('/login', (request, response) => userController.loginUser(request, response));
router.get('/users', (request, response) => userController.getUsers(request, response));
router.get('/users/:id', (request, response) => userController.findUser(request, response));
router.get('/users/:username/messages', (request, response) => userController.getUserMessages(request, response));

router.post('/:chatId/send-message', (request, response) => messageController.sendMessage(request, response));

module.exports = router;