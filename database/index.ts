const chalk = require("chalk");
const debug = require("debug")("escroom:database");
const mongoose = require("mongoose");

const initializeMongo = (connectionString) =>
  new Promise<void>((resolve, reject) => {
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-underscore-dangle
        delete ret.__v;
      },
    });
    mongoose.set("debug", true);
    mongoose.connect(connectionString, (error) => {
      if (error) {
        debug(chalk.redBright("Failed connection with the database"));
        debug(chalk.redBright(error.message));
        reject();
        return;
      }
      debug(chalk.greenBright(`Connected with the database `));
      resolve();
    });
  });

export = initializeMongo;
