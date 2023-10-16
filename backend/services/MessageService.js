const env = require('../.env')
const Telegraf = require('telegraf');
const { Message } = require('../models/Message');

module.exports = class MessageService {
    sendMessage = async (params) => {
        try {
            const { username, message, chatId } = params;

            this.saveUserMessage(params);

            const botMessageReceive = `Message received via external plataform:\n${username}: ${message}`;

            const bot = new Telegraf(env.botToken);

            // Send the message to the user via Telegram
            await bot.telegram.sendMessage(chatId, botMessageReceive);
            
            return { status: 201, message: "Message sent successfully!" };
        } catch (error) {
            console.error('MessageService::sendMessage ', error);
            throw `Error ${error}`;
        }
    }

    saveUserMessage = async (params) => {
        try {
            const { username, message, sendTo, chatId } = params;

            const newMessage = new Message({
                username,
                message,
                sendTo,
                chatId,
                date: new Date()
            });

            await newMessage.save();
        } catch (error) {
            console.error('MessageService::saveMessage ', error);
            throw `Error ${error}`;
        }
    }

    saveBotMessage = async (message, sendTo, chatId) => {
        try {
            const botMessage = new Message({
                username: 'Bot',
                message: message,
                date: new Date(),
                sendTo: sendTo,
                chatId: chatId
            });

            await botMessage.save();
        } catch (error) {
            console.error('BotService::saveBotMessages ', error);
            throw `Error ${error}`;
        }
    }
}