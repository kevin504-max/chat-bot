const env = require('../.env')
const Telegraf = require('telegraf');
const axios = require('axios');
module.exports = class BotService {
    buildBotMessage = async (message, chatId, username) => {
        const commandMap = {
            '/start': (args, username) => {
                return `Very welcome ${username}!`;
            },
            '/help': () => {
                return `Hello! 👋 I'm FlashBot, and I'm here to assist you! 🤖\n\nHere are some of the commands you can use:\n\n- /weather <city> - I'll provide you with the weather for the city you choose.\n\n- /news - I'll keep you updated with the top 5 news of the day from news.api.org.\n\n- /currency <CurrencyA> <CurrencyB> <AMOUNT> - I can convert currencies for you! For example, /currency USD EUR 100.\n\n- /joke - I enjoy making people laugh! I'll tell you a joke.\n\n- /search <anything> - I can search the web for anything you want. Just tell me what to look for.\n\n- /start - A friendly greeting! We start here. 😊\n\n- /info - I'll provide some extra information about myself.\n\nFeel free to try any of these commands, and I'm here to answer your questions and help with anything you need!`;
            },
            '/info': () => {
                return `- I was developed using Node.js and Vue.js.\n\n- I use MongoDB as my database.\n\n- I'm available online at https://chat-bot-wheat-two.vercel.app/chat.`;
            },
            '/weather': async (args) => {
                if (args.length > 0) {
                    const cityName = args.join(' ');
                    return await this.getWeather(cityName);
                } else {
                    return 'Please provide a city name for the weather command.';
                }
            },
            '/news': async () => {
                return await this.getNews();
            },
            '/currency': async (args) => {
                if (args.length >= 3) {
                    const currencyFrom = args[0];
                    const currencyTo = args[1];
                    const amount = args[2];
                    return await this.currencyConverter(currencyFrom, currencyTo, amount);
                } else {
                    return 'Please provide the source currency, target currency, and amount for the currency command.';
                }
            },
            '/search': async (args) => {
                if (args.length > 0) {
                    const searchTerm = args.join(' ');
                    return await this.searchOnWeb(searchTerm);
                } else {
                    return 'Please provide a search term for the search command.';
                }
            },
            '/joke': async () => {
                return await this.getJoke();
            },
        };

        try {
            const bot = new Telegraf(env.botToken);
            let replyMessage = '';
            const possibleMessages = [
                'Sorry, I did not understand that!',
                'Sorry, could you repeat that?',
                'Sorry, I did not get that!',
                'I can only respond to predefined commands.',
                'Please use one of the available commands.',
                'I am programmed to understand specific commands.',
                'You can choose from the following predefined commands.',
            ];
            
            const command = message.split(' ')[0]; // Take the first token of the message
            const args = message.split(' ').slice(1); // Take the arguments after the command

            if (commandMap.hasOwnProperty(command)) {
                replyMessage = await commandMap[command](args, username);
            } else {
                replyMessage = `${possibleMessages[Math.floor(Math.random() * possibleMessages.length)]}\n\n- Type /help to see the available commands.`;
            }
                
            // Send the message
            bot.telegram.sendMessage(chatId, replyMessage);

            return replyMessage;
        } catch (error) {
            console.error('BotService::buildBotMessage ', error);
            throw `Error ${error}`;
        }
    }

    getWeather = async (cityName) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${env.weatherApiKey}`);

            if (response.data.cod === '404' || response.data.cod === 404) {
                return 'City not found!';
            }

            let message = `
                The weather in ${response.data.name} is ${response.data.weather[0].description} and the temperature is ${(response.data.main.temp - 273.15).toFixed(2)}°C. And the humidity is ${response.data.main.humidity}%.
            `;
    
            return message;
        } catch (error) {
            console.error('BotService::getWeather ', error);
            return `There was an error retrieving the weather for "${cityName}"!`;
        }
    }

    getNews = async () => {
        try {
            const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${env.newsApiKey}`);

            if (response.data.status === 'error' || response.data.status === 'Error') {
                return 'There was an error retrieving the news!';
            }

            let message = `Here are the top 5 news headlines:\n\n`;

            for (let i = 0; i < 5; i++) {
                message += `${i + 1} - ${response.data.articles[i].title}\n\n${response.data.articles[i].description}\n\nRead more at ${response.data.articles[i].url}\n\n`;
            }
    
            return message;
        } catch (error) {
            console.error('BotService::getNews ', error);
            return `There was an error retrieving the news!`;
        }
    }

    currencyConverter = async (currencyFrom, currencyTo, amount) => {
        try {
            if (amount.indexOf(',') > -1) {
                amount = amount.replace(',', '.');
            }

            const errorMessage = this.validateCurrencyInput(currencyFrom, currencyTo, amount);
            if (errorMessage) {
                return errorMessage;
            }

            const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${currencyFrom}`);

            if (response.data.result === 'error' || response.data.result === 'Error') {
                return 'There was an error converting the currency!';
            }

            let message = `
                The conversion from ${currencyFrom} to ${currencyTo} is ${(response.data.rates[currencyTo] * amount).toFixed(2).replace('.', ',')}.
            `;

            return message;
        } catch (error) {
            console.error('BotService::currencyConverter ', error);
            return `There was an error converting the currency!`;
        }
    }

    validateCurrencyInput = (currencyFrom, currencyTo, amount) => {        
        if (currencyFrom === currencyTo) {
            return 'The currencies must be different!';
        }

        if (amount === undefined || amount === '') {
            return 'You must inform the amount!';
        }

        if (isNaN(amount)) {
            return 'The amount must be a number!';
        }

        if (currencyFrom.length !== 3 || currencyTo.length !== 3) {
            return 'The currencies must have 3 characters!';
        }

        if (!currencyFrom.match(/^[a-zA-Z]+$/) || !currencyTo.match(/^[a-zA-Z]+$/)) {
            return 'The currencies must only have letters!';
        }

        return null;
    }

    searchOnWeb = async (searchTerm) => {
        try {
            const response = await axios.get(`https://www.google.com/search?q=${searchTerm}`);

            if (response.status !== 200) {
                return 'There was an error searching on the web!';
            }

            return 'Search results: https://www.google.com/search?q=' + searchTerm;
        } catch (error) {
            console.error('BotService::searchOnWeb ', error);
            return `There was an error searching on the web!`;
        }
    }

    getJoke = async () => {
        try {
            const response = await axios.get(`https://official-joke-api.appspot.com/random_joke`);

            if (response.status !== 200) {
                return 'There was an error searching on the web!';
            }

            return response.data.setup + ' ' + response.data.punchline;
        } catch (error) {
            console.error('BotService::searchOnWeb ', error);
            return `There was an error searching on the web!`;
        }
    }
}