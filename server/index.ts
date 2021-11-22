const chalk = require("chalk");
const cors = require("cors");
const debug = require("debug")("escroom:server");
const express = require("express");
const morgan = require("morgan");
const {
  notFoundErrorHandler,
  generalErrorHandler,
} = require("./middlewares/error");

const app = express();
app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const initializeServer = (port) =>
  new Promise<void>((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.yellowBright(`Server is listening on port: ${port}`));
      resolve(server);
    });

    server.on("error", (error) => {
      debug(chalk.redBright("There was an error starting the server"));
      if (error.code === "EADDRINUSE") {
        debug(chalk.redBright(`The port ${port} is in use.`));
      }
      reject();
    });

    server.on("close", () => {
      debug(chalk.yellowBright("Server disconnected"));
    });
  });

app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

export = { initializeServer };
