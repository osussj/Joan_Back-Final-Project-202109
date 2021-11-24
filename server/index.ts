import chalk from "chalk";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import Debug from "debug";
import { notFoundErrorHandler, generalErrorHandler } from "./middlewares/error";
import userRoutes from "./routes/userRoutes";
import roomRoutes from "./routes/roomRoutes";

const debug = Debug("escroom:server");

export const app = express();
app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

export const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.yellowBright(`Server is listening on port: ${port}`));
      resolve(server);
    });

    server.on("error", (error) => {
      debug(chalk.redBright("There was an error starting the server"));
      if (error.message === "EADDRINUSE") {
        debug(chalk.redBright(`The port ${port} is in use.`));
      }
      reject();
    });

    server.on("close", () => {
      debug(chalk.yellowBright("Server disconnected"));
    });
  });

app.use("/api/user", userRoutes);
app.use("/api/room", roomRoutes);
app.use(notFoundErrorHandler);
app.use(generalErrorHandler);
