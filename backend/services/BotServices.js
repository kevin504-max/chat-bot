const env = require('../.env')
const axios = require('axios');
module.exports = class BotServices {
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
            console.error('BotServices::getWeather ', error);
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
            console.error('BotServices::getNews ', error);
            return `There was an error retrieving the news!`;
        }
    }

    currencyConverter = async (currencyFrom, currencyTo, amount) => {
        try {
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
            console.error('BotServices::currencyConverter ', error);
            return `There was an error converting the currency!`;
        }
    }

    validateCurrencyInput = (currencyFrom, currencyTo, amount) => {
        if (amount.indexOf(',') > -1) {
            amount = amount.replace(',', '.');
        }
        
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
            console.error('BotServices::searchOnWeb ', error);
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
            console.error('BotServices::searchOnWeb ', error);
            return `There was an error searching on the web!`;
        }
    }
}