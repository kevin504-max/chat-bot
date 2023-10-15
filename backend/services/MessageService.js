const env = require('../.env')
const Telegraf = require('telegraf');
const { Message } = require('../models/Message');

module.exports = class MessageService {
    sendMessage = async (params) => {
        try {
            const { username, message, chatId } = params;

            const bot = new Telegraf(env.botToken);
            await bot.telegram.sendMessage(chatId, message, {
                from: username
            });

            this.saveMessage(params);

            return { status: 201, message: "Message sent successfully!" };
        } catch (error) {
            console.error('MessageService::sendMessage ', error);
            throw `Error ${error}`;
        }
    }

    saveMessage = async (params) => {
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
}