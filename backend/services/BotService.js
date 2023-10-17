const env = require('../.env')
const Telegraf = require('telegraf');
const axios = require('axios');
module.exports = class BotService {
    buildBotMessage = async (message, chatId, username) => {
        try {
            const bot = new Telegraf(env.botToken);
            let replyMessage = "Default Message Here!";
            const possibleMessages = [
                'Sorry, I did not understand that!',
                'Sorry, could you repeat that?',
                'Sorry, I did not get that!',
                'I can only respond to predefined commands.',
                'Please use one of the available commands.',
                'I am programmed to understand specific commands.',
                'You can choose from the following predefined commands.',
            ];
            
            if (message === 'ping') {
                replyMessage = 'pong';
                bot.telegram.sendMessage(chatId, replyMessage);
            } else if (message === '/start') {
                replyMessage = `Welcome ${username}!`;
                bot.telegram.sendMessage(chatId, replyMessage);
            } else if (message === '/help') {
                replyMessage = `
                    Hello! 👋 I'm FlashBot, and I'm here to assist you! 🤖

                    Here are some of the commands you can use:
                    
                    - /weather <city> - I'll provide you with the weather for the city you choose.
                    - /news - I'll keep you updated with the top 5 news of the day from news.api.org.
                    - /currency <CurrencyA> <CurrencyB> <AMOUNT> - I can convert currencies for you! For example, /currency USD EUR 100.
                    - /joke - I enjoy making people laugh! I'll tell you a joke.
                    - /search <anything> - I can search the web for anything you want. Just tell me what to look for.
                    - /start - A friendly greeting! We start here. 😊
                    - /info - I'll provide some extra information about myself.
                    
                    Feel free to try any of these commands, and I'm here to answer your questions and help with anything you need!
                `;
                bot.telegram.sendMessage(chatId, replyMessage);
            } else if (message === '/info') {
                replyMessage = `
                    - I was developed using Node.js and Vue.js.
                    - I use MongoDB as my database.
                    - I'm available online at https://chat-bot-wheat-two.vercel.app/chat.
                `;
                bot.telegram.sendMessage(chatId, replyMessage);
            } else if (message.indexOf('/weather') > -1) {
                const cityName = message.replace('/weather', '').trim();
                replyMessage = await this.getWeather(cityName);
                bot.telegram.sendMessage(chatId, replyMessage);
            } else if (message.indexOf('/news') > -1) {
                replyMessage = await this.getNews();
                bot.telegram.sendMessage(chatId, replyMessage);
            } else if (message.indexOf('/currency') > -1) {
                const currencyFrom = message.split(' ')[1];
                const currencyTo = message.split(' ')[2];
                const amount = message.split(' ')[3];
                replyMessage = await this.currencyConverter(currencyFrom, currencyTo, amount);
                bot.telegram.sendMessage(chatId, replyMessage);
            } else if (message.indexOf('/search') > -1) {
                const searchTerm = message.replace('/search', '').trim();
                replyMessage = await this.searchOnWeb(searchTerm);
                bot.telegram.sendMessage(chatId, replyMessage);
            } else if (message.indexOf('/joke') > -1) {
                replyMessage = await this.getJoke();
                bot.telegram.sendMessage(chatId, replyMessage);
            } else {
                const randomIndex = Math.floor(Math.random() * possibleMessages.length);
                replyMessage = `${possibleMessages[randomIndex]}
                - Type /help to see the available commands.`;
                bot.telegram.sendMessage(chatId, replyMessage);
            }

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

            let message = `
                Here are the top 5 news headlines:
            `;

            for (let i = 0; i < 5; i++) {
                message += `
                    ${i + 1} - ${response.data.articles[i].title}
                `;
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