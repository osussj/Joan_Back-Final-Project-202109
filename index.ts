import dotenv from "dotenv";

dotenv.config();
import { initializeServer } from "./server/index";

import initializeMongo from "./database/index";

const port = process.env.PORT ?? process.env.SERVER_PORT ?? 5000;

(async () => {
  try {
    await initializeMongo(process.env.MONGODB_STRING);
    await initializeServer(port);
  } catch (error) {
    process.exit(1);
  }
})();
