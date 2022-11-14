import { Client } from "discord.js";

export default class Raw {
  type: string;

  constructor() {
    this.type = 'raw';
  }

  execute(client: Client<true>, packet, x) {
    client.manager.updateVoiceState(packet);
  }
}