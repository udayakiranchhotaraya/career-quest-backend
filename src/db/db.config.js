const mongoose = require('mongoose');
const logger = require('../utils/logger');

async function connectDB () {
    DB_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}`;
    DB_NAME = `${process.env.MONGO_DATABASE}`;

    try {
        const connectionInstance = await mongoose.connect(`${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`);
        console.log(`Database \`${DB_NAME}\` connected;\nDB HOST: \`${connectionInstance.connection.host}\``);
        logger.info(`Database \`${DB_NAME}\` connected`);
        logger.info(`DB HOST: \`${connectionInstance.connection.host}\``);
    } catch (error) {
        console.error(`Connection Error: ${error}`);
        process.exit(1);
    }
}

module.exports = connectDB;