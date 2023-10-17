# FlashBot FullStack API 🤖

The FlashBot Fullstack API is a comprehensive project involving the creation of a chatbot within the Telegram messaging application. 
This chatbot was meticulously developed to serve as a user assistance tool, streamlining tasks through straightforward commands. 
With its efficient and user-friendly approach, the FlashBot provides valuable information and offers a practical way to interact.

Furthermore, it's important to note that the bot is fully integrated with Telegram and has an external interface 
accessible by clicking on [here](https://chat-bot-wheat-two.vercel.app/chat). However, it is imperative that the bot is started within the Telegram application beforehand.

## 🛠 Technologies Used
The project was built using the following technologies:

* [NodeJS](https://nodejs.org/en)
* [VueJS](https://vuejs.org/)
* [ExpressJS](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Telegram Bot API](https://core.telegram.org/)
* [Jest](https://jestjs.io/en/)

## 📌 Prerequisites
Before you begin, ensure you have the following tools installed:

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/en)
* A code editor such as [VSCode](https://code.visualstudio.com/)

## 🏡 Getting Started Locally

1. Clone this repository
```bash
  git clone https://github.com/kevin504-max/chat-bot.git
```

2. Configure your database on [MongoDB Atlas](https://account.mongodb.com/), login with your account and get your database credentials.
After create yur database, click in "Connect", then option "Compass", you gonna see the link to connect with your database.

3. Update the .env file with your credentials
```bash
  DB_USER='YOUR_USER'
  DB_PASSWORD='YOUR_PASSWORD'
```

4. Go to the file "databaseConnection.js" file and update with your access link.

5. Now you need to configure your bot token, for this you gonna look for "BotFather" in Telegram,
and choose the one with the verification seal.

6. In the BotFather chat, you gonna start the bot and enter with the command "/newbot", and named you new bot.
Doing that you gonna receive your bot token, with this you gonna update, again, your .env file

```bash
  BOT_TOKEN='YOUR_BOT_TOKEN'
```

7. Navigate to the backend folder and install the dependencies
```bash
  cd backend
  npm install
```

8. To start the server application run
```bash
  npm run start
```

9. Do the same process to install the frontend dependencies
```bash
  cd frontend
  npm install
```

10. And then run
```bash
  npm run serve
```

11. Before begin your interation with the bot in our application, you need to go in your bot chat, and start the bot.
With this, the system gonna be able to get the chat id, and the functionalities gonna work perfectly.

12. Finally you can register in the web application and interact with your bot :]

## 📖 Available commands
Commands supported by the bot

* [/start](#) - Receive a welcome message
* [/info](#) - Receveive some informations about the bot development
* [/weather <city>](#) - Receive the weather city description
* [/news](#) - Receive the top 5 news of the day (font: [https://newsapi.org/])
* [/currency <CurrencyA> <CurrecyB> <Amount>](#) - Convert the amount between the currencies
* [/search <word>](#) - Gonna receive a link with the word serach in google
* [/joke](#) - Receive a hilarious bot joke 🤡

### ⚠️ Another input messages
The bot have an array with possible messages for that case so, you don't gonna receive a message coherent with your input message (yet).

## 🧪 Automated Tests
The systems can make automated tests, in locally for example, after start the application with `npm run start`
You can be able to execute the following command, and follow the process
```bash
  npm test
```

## 🚀 Getting Started >>Online<<
If you get in here following all the steps you're able to use the application in an online server.
All you have to do is, click in this [link](https://chat-bot-wheat-two.vercel.app/). 
Make your authentication normally, and talk with your bot in the external interface web you gonna see the messages in Telegram too.

### 🎥 Presentation Video
I understand that is it a lot of complicated steps, so for security i gonna show the application working and running for you!
To access the short and instructive video click [here](#).

### 🤝 Acknowledgment
I extend our heartfelt appreciation to Flashvolve for this exciting and engaging technical challenge.
This challenge has allowed me to showcase my skills and creativity in the realms of Vue.js and Node.js 
while focusing on seamless integration with the Telegram API.