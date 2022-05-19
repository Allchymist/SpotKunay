import { CommandInteraction } from "discord.js";

import Command from "../../Base";

export default class Ping extends Command {
  constructor() {
    super();

    this.data = {
      name: 'ping',
      description: 'Ping!',
    };

  }

  run(int: CommandInteraction) {
    return int.editReply(`Pong! ${Math.round(int.client.ws.ping)}ms`);
  }
}