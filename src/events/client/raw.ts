import { Client } from "discord.js";

export default class Raw {
  type: string;

  constructor() {
    this.type = 'raw';
  }

  execute(client: Client, d) {
    client.manager.updateVoiceState(d);
  }
}