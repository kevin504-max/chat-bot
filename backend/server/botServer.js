const env = require('../.env')
const Telegraf = require('telegraf');
const { BotServices } = require('../services');
const botService = new BotServices();

class BotServer {
    constructor () {}

    initialize = async () => {
        // Instantiate a new bot
        const bot = new Telegraf(env.botToken);

        // Listen to the /start command
        bot.command('start', (ctx) => ctx.reply(`Welcome ${ctx.message.from.first_name}!`));

        // Listen to the /info command
        bot.command('info', (ctx) => {
            ctx.reply(`
                Info message here!
            `);
        });

        // Listen to the /help command
        bot.command('help', (ctx) => {
            ctx.reply(`
                Help message here!
            `);
        });

        // Listen to the /weather command
        bot.command('weather', async (ctx) => ctx.reply(await botService.getWeather(ctx.message.text.replace('/weather ', ''))));

        // Listen to the /news command
        bot.command('news', async (ctx) => ctx.reply(await botService.getNews()));

        // Listen to the /currency command
        bot.command('currency', async (ctx) => {
            const message = ctx.message.text.replace('/currency ', '').split(' ');

            ctx.reply(await botService.currencyConverter(message[0], message[1], message[2]));
        });

        // Listen to the /search command
        bot.command('search', async (ctx) => {
            const searchTerm = ctx.message.text.replace('/search ', '').trim();

            if (searchTerm.length === 0 || searchTerm === '/search' || !searchTerm) {
                ctx.reply('Please enter a search term!');
                return;
            }

            ctx.reply(await botService.searchOnWeb(searchTerm));
        }); 

        // Listen to /joke command
        bot.command('joke', async (ctx) => {
            ctx.reply(await botService.getJoke());
        });

        this.bot = bot;
    }

    getBot = () => {
        return this.bot;
    }
}

module.exports = BotServer;