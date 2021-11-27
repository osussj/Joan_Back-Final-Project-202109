import admin from "firebase-admin";
import Debug from "debug";
import chalk from "chalk";

const debug = Debug("escroom:upload");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "escroom-db.appspot.com",
});

const firebase = async (req, res, next) => {
  try {
    const bucket = admin.storage().bucket();
    await bucket.upload(req.file.path);
    await bucket.file(req.file.filename).makePublic();
    const fileURL = bucket.file(req.file.filename).publicUrl();
    debug(chalk.green(fileURL));
    req.file.fileURL = fileURL;
    next();
  } catch (error) {
    next();
  }
};

export default firebase;
