const app = require('./app');
const config = require('./config');
const connectDB = require('./config/database');

// Connect to database
connectDB();

const server = app.listen(config.port, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
});

// Handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//   console.error(`Ind Error: ${err.message}`);
//   // Close server & exit process
//   server.close(() => process.exit(1));
// });

module.exports = server;