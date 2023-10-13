const ApiServer = require('./server/server');
const BotServer = require('./server/botServer')

const startApplication = async () => {
    try {
        const config = require('./config/config');
        const mongoose = require('./database/databaseConnection');

        await mongoose.connect();

        const apiServer = new ApiServer();

        apiServer.initialize().then(() => {
            apiServer.getApplication().listen(config.port, () => {
                console.log(`Application listening on port ${config.port}!`);
            });
        }).catch((error) => {
            console.log('Api Server Error: ', error);
            throw `Error: ${error}.`;
        });

        const botServer = new BotServer();

        botServer.initialize().then(() => {
            botServer.getBot().startPolling();            
            console.log('Bot started successfully!');
        }).catch((error) => {
            console.log('Bot Server Eerror: ', error);
            throw `Error: ${error}`
        });
    } catch (error) {
        console.log('Error starting application: ', error);
        throw `Error: ${error}.`;
    }
}

startApplication();