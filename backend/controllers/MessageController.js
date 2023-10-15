const { MessageService } = require('../services');
const messageService = new MessageService();

module.exports = class MessageController {
    sendMessage = async (req, res) => {
        try {
            const { username, message } = req.body;
            const chatId = req.params.chatId;
            const sendTo = (username !== 'Bot') ? 'Bot' : username;

            const response = await messageService.sendMessage({ username, message, sendTo, chatId });

            res.status(response.status).send(response.message);
        } catch (error) {
            console.error('MessageController::sendMessage ', error);
            res.status(500).send(`Error ${error}`);
        }
    }
}