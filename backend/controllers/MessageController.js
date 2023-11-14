const { BotService, HashGameService, MessageService } = require('../services');

const messageService = new MessageService();
const botService = new BotService();
const hashGameService = new HashGameService();

const PLAY_COMMAND = '/hashGame';
const USER_SYMBOLS = ['X', 'O', 'x', 'o'];
const MOVIMENTS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const CHOICES = ['X', 'O'];

let firstTurn = '';
let robotChoice = '';
let userChoice = '';
let isPlaying = false;

module.exports = class MessageController {
    sendMessage = async (req, res) => {
        try {
            const { username, message } = req.body;
            const chatId = req.params.chatId;
            const sendTo = (username !== 'Bot') ? 'Bot' : username;

            const response = await messageService.sendMessage({ username, message, sendTo, chatId });

            if (message === PLAY_COMMAND) {
                isPlaying = true;
                messageService.saveBotMessage('Choose your symbol: X or O', username, chatId);
            }

            if (isPlaying) {
                if (robotChoice === '' && userChoice === '') {
                    const symbol = message.toUpperCase();
                    const selectedSymbol = USER_SYMBOLS.includes(symbol) ? symbol : null;

                    if (selectedSymbol) {
                        robotChoice = (symbol === CHOICES[0]) ? CHOICES[1] : CHOICES[0];
                        userChoice = symbol;

                        messageService.saveBotMessage(`You chose ${symbol}!\nDo you want to start? (Y/N):`, username, chatId);
                    }
                } else if (['Y', 'N'].includes(message.toUpperCase())) {
                    firstTurn = message.toUpperCase();
                    await hashGameService.gameLoop(robotChoice, userChoice, firstTurn, chatId, username);
                } else if (MOVIMENTS.includes(message)) {
                    await hashGameService.UserTurn(robotChoice, userChoice, chatId, message, username);
                }
            }

            if (!([PLAY_COMMAND, ...USER_SYMBOLS, 'Y', 'N', 'y', 'n', ...CHOICES, ...MOVIMENTS].includes(message))) {
                isPlaying = false;
                await this.sendNonGameMessage(message, chatId, username);
            }

            res.status(response.status).send(response.message);
        } catch (error) {
            console.error('MessageController::sendMessage ', error);
            res.status(500).send(`Error ${error}`);
        }
    }

    async sendNonGameMessage(message, chatId, username) {
        const botMessage = await botService.buildBotMessage(message, chatId, username);
        messageService.saveBotMessage(botMessage, username, chatId);
    }
};