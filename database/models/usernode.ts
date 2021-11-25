import { model, Schema } from "mongoose";

interface IUsernode {
  username: string;
  password: string;
  is_admin?: boolean;
}

const usernodeSchema: Schema<IUsernode> = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
});

const Usernode = model<IUsernode>("usernode", usernodeSchema, "usersnode");

export default Usernode;
