require("dotenv").config();
const initializeMongo = require("./database/index");

const { initializeServer } = require("./server/index");

const port = process.env.PORT ?? process.env.SERVER_PORT ?? 5000;

(async () => {
  try {
    await initializeMongo(process.env.MONGODB_STRING);
    await initializeServer(port);
  } catch (error) {
    process.exit(1);
  }
})();
