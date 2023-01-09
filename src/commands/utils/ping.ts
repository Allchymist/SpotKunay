import { ApplicationCommandData, ChatInputCommandInteraction, Client } from "discord.js";

export default class Ping {
  data: ApplicationCommandData;

  constructor() {
    this.data = {
      name: 'ping',
      description: 'Ping!',
    }
  }

  execute(client: Client, int: ChatInputCommandInteraction) {
    return int.editReply(`Pong! ${Math.round(client.ws.ping)}ms`);
  }
}