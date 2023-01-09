import { model, Schema } from "mongoose";

import { IGuild } from "../interfaces/guilds.interface";

const GuildSchema = new Schema<IGuild>({
  _id: String,
  isPremium: Boolean,
});

export const GuildModel = model<IGuild>('guilds', GuildSchema);
