const app = require('./app');
const connectDB = require('./db/db.config');
const winston = require('winston'); // Optional: for logging

const PORT = process.env.PORT || 3000;

(async function () {
  try {
    // Connect to database
    await connectDB();
    app.on('error', (error) => {
      console.error(`Express app initialisation error: ${error}`);
    });
    // Start the server
    app.listen(PORT, () => { console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`); });
  } catch (error) {
    console.error(`Connection error: ${error}`);
    process.exit(1);
  }
})()