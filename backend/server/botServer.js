const env = require('../.env')
const Telegraf = require('telegraf');
const { BotServices } = require('../services');
const botService = new BotServices();
const { Message } = require('../models/Message');

class BotServer {
    constructor () {}

    saveBotMessages = async (message, sendTo, chatId) => {
        try {
            // Save the bot message
            const botMessage = new Message({
                username: 'Bot',
                message: message,
                date: new Date(),
                sendTo: sendTo,
                chatId: chatId
            });

            await botMessage.save();
        } catch (error) {
            console.error('BotServices::saveBotMessages ', error);
            return `There was an error saving the message!`;
        }
    }

    initialize = async () => {
        // Instantiate a new bot
        const bot = new Telegraf(env.botToken);

        // Middleware to save messages to the database
        bot.use(async (ctx, next) => {
            const messageText = ctx.message.text || '';

            if (ctx.message.from) {
                // Save the user message
                const userMessage = new Message({
                    username: ctx.message.from.first_name,
                    message: messageText,
                    date: new Date(),
                    sendTo: 'Bot',
                    chatId: ctx.message.chat.id,
                });

                await userMessage.save();
            }

            // Continue to the next middleware
            await next();
        });

        // Listen to the /start command
        bot.command('start', (ctx) => {
            console.log('ctx.message ', ctx.message);
            const message = `Welcome ${ctx.message.from.first_name}!`;
            
            this.saveBotMessages(message, ctx.message.from.first_name, ctx.message.chat.id);            
            ctx.reply(message);
        });

        // Listen to the /info command
        bot.command('info', (ctx) => {
            const message = `
                Info message here!
            `;

            this.saveBotMessages(message, ctx.message.from.first_name, ctx.message.chat.id);
            ctx.reply(message, ctx.message.from.first_name);
        });

        // Listen to the /help command
        bot.command('help', (ctx) => {
            const message = `
                Help message here!
            `;
            
            this.saveBotMessages(message, ctx.message.from.first_name, ctx.message.chat.id);
            ctx.reply(message);
        });

        // Listen to the /weather command
        bot.command('weather', async (ctx) => {
            const message = await botService.getWeather(ctx.message.text.replace('/weather ', ''));
            
            this.saveBotMessages(message, ctx.message.from.first_name, ctx.message.chat.id);
            ctx.reply(message);
        });

        // Listen to the /news command
        bot.command('news', async (ctx) => {
            const message = await botService.getNews();
            
            this.saveBotMessages(message, ctx.message.from.first_name, ctx.message.chat.id);
            ctx.reply(message);
        });

        // Listen to the /currency command
        bot.command('currency', async (ctx) => {
            const inputMessage = ctx.message.text.replace('/currency ', '').split(' ');
            const message = await botService.currencyConverter(inputMessage[0], inputMessage[1], inputMessage[2]);
            
            this.saveBotMessages(message, ctx.message.from.first_name, ctx.message.chat.id);
            ctx.reply(message);
        });

        // Listen to the /search command
        bot.command('search', async (ctx) => {
            const searchTerm = ctx.message.text.replace('/search ', '').trim();

            if (searchTerm.length === 0 || searchTerm === '/search' || !searchTerm) {
                ctx.reply('Please enter a search term!');
                return;
            }

            const message = await botService.searchOnWeb(searchTerm);
            
            this.saveBotMessages(message, ctx.message.from.first_name, ctx.message.chat.id);
            ctx.reply(message);
        }); 

        // Listen to /joke command
        bot.command('joke', async (ctx) => {
            const message = await botService.getJoke();

            this.saveBotMessages(message, ctx.message.from.first_name, ctx.message.chat.id);
            ctx.reply(message);
        });

        this.bot = bot;
    }

    getBot = () => {
        return this.bot;
    }
}

module.exports = BotServer;