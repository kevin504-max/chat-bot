const { MessageService } = require('../services');
const messageService = new MessageService();

const { BotService } = require('../services');
const botService = new BotService();

module.exports = class MessageController {
    sendMessage = async (req, res) => {
        try {
            const { username, message } = req.body;
            const chatId = req.params.chatId;
            const sendTo = (username !== 'Bot') ? 'Bot' : username;

            const response = await messageService.sendMessage({ username, message, sendTo, chatId });

            // Build the bot message to user in the external plataform and save it to the database
            await botService.buildBotMessage(message, chatId, username).then((response) => {
                messageService.saveBotMessage(response, username, chatId);
            });

            res.status(response.status).send(response.message);
        } catch (error) {
            console.error('MessageController::sendMessage ', error);
            res.status(500).send(`Error ${error}`);
        }
    }
}