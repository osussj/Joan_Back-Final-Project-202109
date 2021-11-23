const { Schema, model } = require("mongoose");

interface IUser {
  name: string;
  username: string;
  password: string;
  email: string;
  is_Admin: boolean;
  avatar: string;
}
const userSchema: IUser = new Schema()({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  is_Admin: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    default:
      "https://www.pinclipart.com/picdir/middle/157-1578186_user-profile-default-image-png-clipart.png",
  },
});

const User: IUser = model("User", userSchema, "users");

export = { User };
