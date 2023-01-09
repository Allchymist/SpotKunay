import { model, Schema } from "mongoose";

import { IUsers } from "../interfaces/users.interface";

const UserSchema = new Schema<IUsers>({
  _id: String,
  username: { type: String, required: true },
  tag: { type: String, required: true },
  avatar: String,
  playlists: Array,
});

export const UserModel = model<IUsers>('users', UserSchema);