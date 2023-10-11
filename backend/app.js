const ApiServer = require('./server/server');

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
            console.log('Error: ', error);
            throw `Error: ${error}.`;
        });
    } catch (error) {
        console.log('Error starting application: ', error);
        throw `Error: ${error}.`;
    }
}

startApplication();