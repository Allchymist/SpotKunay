import { connect, set } from "mongoose";

import { UserModel } from "./schema/users.model";
import { GuildModel } from "./schema/guilds.models";

export class Database {
  user: typeof UserModel;
  guild: typeof GuildModel;

  constructor() {
    this.user = UserModel;
    this.guild = GuildModel;

    this.Connect();
  }

  private Connect() {
    set('strictQuery', true);

    connect(process.env.MONGO_URL, (err) => {
      if (err) {
        console.error('[CLIENT]', err);
        return process.exit(1);
      }

      return console.log('[CLIENT] Database MongoDb Connect');
    });
  }
}
