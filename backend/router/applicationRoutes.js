const router = require('express').Router();
const UserController = require('../controllers/UserController');
const userController = new UserController();

router.post('/register', (request, response) => userController.registerUser(request, response));
router.post('/login', (request, response) => userController.loginUser(request, response));
router.get('launches', (request, response) => userController.getUsers(request, response));
router.get('launches/:id', (request, response) => userController.findUser(request, response));


module.exports = router;