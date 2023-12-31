const env = require('../.env')
const Telegraf = require('telegraf');
const { BotService, HashGameService } = require('../services');
const botService = new BotService();
const hashGameService = new HashGameService();
const { Message } = require('../models/Message');
// const OpenAI = require('openai');

class BotServer {
    constructor () {}

    initialize = async () => {
        // Instantiate a new bot
        const bot = new Telegraf(env.botToken);

        // Instantiate a new OpenAI
        // const openai = new OpenAI({apiKey: env.openAiKey});

        // Middleware to save messages to the database
        bot.use(async (ctx, next) => {
            const messageText = ctx.message.text || '';

            if (ctx.message.from) {
                // Save the user message
                const userMessage = new Message({
                    username: ctx.message.from.username,
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
            const message = `Very welcome ${ctx.message.from.username}!`;
            
            this.saveBotMessages(message, ctx.message.from.username, ctx.message.chat.id);            
            ctx.reply(message);
        });

        // Listen to the /info command
        bot.command('info', (ctx) => {
            const message = `\n\n- I was developed using Node.js and Vue.js.\n\n- I use MongoDB as my database.\n\n- I'm available online at https://chat-bot-wheat-two.vercel.app/chat.`;

            this.saveBotMessages(message, ctx.message.from.username, ctx.message.chat.id);
            ctx.reply(message, ctx.message.from.username);
        });

        // Listen to the /help command
        bot.command('help', (ctx) => {
            const message = `
                Hello! 👋 I'm FlashBot, and I'm here to assist you! 🤖\n\nHere are some of the commands you can use:\n\n- /weather <city> - I'll provide you with the weather for the city you choose.\n\n- /news - I'll keep you updated with the top 5 news of the day from news.api.org.\n\n- /currency <CurrencyA> <CurrencyB> <AMOUNT> - I can convert currencies for you! For example, /currency USD EUR 100.\n\n- /joke - I enjoy making people laugh! I'll tell you a joke.\n\n- /search <anything> - I can search the web for anything you want. Just tell me what to look for.\n\n- /start - A friendly greeting! We start here. 😊\n\n- /info - I'll provide some extra information about myself.\n\nFeel free to try any of these commands, and I'm here to answer your questions and help with anything you need!
            `;
            
            this.saveBotMessages(message, ctx.message.from.username, ctx.message.chat.id);
            ctx.reply(message);
        });

        // Listen to the /weather command
        bot.command('weather', async (ctx) => {
            const message = await botService.getWeather(ctx.message.text.replace('/weather ', ''));
            
            this.saveBotMessages(message, ctx.message.from.username, ctx.message.chat.id);
            ctx.reply(message);
        });

        // Listen to the /news command
        bot.command('news', async (ctx) => {
            const message = await botService.getNews();
            
            this.saveBotMessages(message, ctx.message.from.username, ctx.message.chat.id);
            ctx.reply(message);
        });

        // Listen to the /currency command
        bot.command('currency', async (ctx) => {
            const inputMessage = ctx.message.text.replace('/currency ', '').split(' ');
            const message = await botService.currencyConverter(inputMessage[0], inputMessage[1], inputMessage[2]);
            
            this.saveBotMessages(message, ctx.message.from.username, ctx.message.chat.id);
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
            
            this.saveBotMessages(message, ctx.message.from.username, ctx.message.chat.id);
            ctx.reply(message);
        }); 

        // Listen to /joke command
        bot.command('joke', async (ctx) => {
            const message = await botService.getJoke();

            this.saveBotMessages(message, ctx.message.from.username, ctx.message.chat.id);
            ctx.reply(message);
        });

        let playing = false;
        // Listen to /hashGame command
        bot.command('hashGame', async (ctx) => {
            playing = true;
            const message = 'Choose your symbol: X or O';
            ctx.reply(message);

            this.saveBotMessages(message, ctx.message.from.username, ctx.message.chat.id);
        });

        let first = '';
        let robotChoice = '';
        let userChoice = '';

        bot.on('message', async (ctx) => {
            try {
                const chatId = ctx.message.chat.id;
                const username = ctx.message.from.username;

                if (ctx.message.text === 'ping') {
                    this.saveBotMessages('pong', username, chatId);
                    ctx.reply('pong');
                    return;
                }

                if (playing) {
                    if (robotChoice === '' && userChoice === '') {
                        const symbol = ctx.message.text.toUpperCase();
        
                        if (symbol === 'X') {
                            robotChoice = 'O';
                            userChoice = 'X';
        
                            ctx.reply('You chose X!\nDo you want to start? (Y/N):');
                        } else if (symbol === 'O') {
                            robotChoice = 'X';
                            userChoice = 'O';
                            
                            ctx.reply('You chose O!\nDo you want to start? (Y/N):');
                        } else {
                            ctx.reply('Invalid choice!\nChoose your symbol: X or O');
                        }
                    }
                    
                    if (ctx.message.text === 'Y' || ctx.message.text === 'y' || ctx.message.text === 'N' || ctx.message.text === 'n') {
                        first = ctx.message.text.toUpperCase();

                        await hashGameService.gameLoop(robotChoice, userChoice, first, ctx.message.chat.id, ctx.message.from.username);
                    }
                    
                    if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(ctx.message.text)) {
                        await hashGameService.UserTurn(robotChoice, userChoice, ctx.message.chat.id, ctx.message.text, ctx.message.from.username);
                    }

                    return;
                }

                const possibleMessages = [
                    'Sorry, I did not understand that!',
                    'Sorry, could you repeat that?',
                    'Sorry, I did not get that!',
                    'I can only respond to predefined commands.',
                    'Please use one of the available commands.',
                    'I am programmed to understand specific commands.',
                    'You can choose from the following predefined commands.',
                ];

                const randomIndex = Math.floor(Math.random() * possibleMessages.length);
                const message = possibleMessages[randomIndex];

                this.saveBotMessages(message, username, ctx.message.chat.id);
                ctx.reply(`${message}\n\nType /help to see the available commands.`);

                // TRYING TO IMPLEMENT OPENAI 
                // =========================================================================================
                // const chatCompletion = await openai.chat.completions.create({
                //     model: 'text-davinci-003',
                //     prompt: ctx.message.text,
                //     temperature: 0.9,
                //     max_tokens: 3000,
                //     top_p: 1,
                //     frequency_penalty: 0.5,
                //     presence_penalty: 0,
                // });

                // console.log(chatCompletion)
                // ctx.reply(chatCompletion.data.choices[0].text);
                // ==========================================================================================
            } catch (error) {
                console.error("Error sending a message: ", error);
            }
        });

        this.bot = bot;
    }

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
            console.error('BotService::saveBotMessages ', error);
            return `There was an error saving the message!`;
        }
    }

    getBot = () => {
        return this.bot;
    }
}

module.exports = BotServer;