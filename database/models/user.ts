import { Schema, model } from "mongoose";

interface IUser {
  name: string;
  username: string;
  password: string;
  email: string;
  isAdmin?: boolean;
  avatar: string;
}
const userSchema: Schema<IUser> = new Schema({
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
  isAdmin: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    default:
      "https://www.pinclipart.com/picdir/middle/157-1578186_user-profile-default-image-png-clipart.png",
  },
});

const User = model<IUser>("user", userSchema, "users");

export default User;
