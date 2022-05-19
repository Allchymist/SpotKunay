import { Client } from "discord.js";

export default class Raw {
  type: string;

  constructor() {
    this.type = 'raw';
  }

  run(client: Client<true>, packet, x) {
    client.Music.updateVoiceState(packet);
  }
}