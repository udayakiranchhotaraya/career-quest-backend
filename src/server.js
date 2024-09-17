const app = require('./app');
const connectDB = require('./db/db.config');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

(async function () {
  try {
    // Connect to database
    await connectDB();
    app.on('error', (error) => {
      logger.error(`Express app initialisation error: ${error}`);
    });
    // Start the server
    app.listen(PORT, () => { 
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Connection error: ${error}`);
    process.exit(1);
  }
})()