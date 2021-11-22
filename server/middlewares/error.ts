const { ValidationError } = require("express-validation");

const debug = require("debug")("escroom:errors");

export const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const generalErrorHandler = (error, req, res, next) => {
  debug("An error has occurred: ", error.message);
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json(error.message);
  }
  const message = error.code ? error.message : "General pete";
  res.status(error.code || 500).json({ error: message });
};
