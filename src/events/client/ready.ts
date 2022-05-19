import { Client } from "discord.js";

import { emoji } from '../../config.json';

export default class Ready {
  type: string;

  constructor() {
    this.type = 'ready';
  }

  run(client: Client<true>) {
    client.Music.init(client.user.id);
    client.emote = emote;

    console.log(`[EVENT READY] ${client.user.tag} is ready!`);

    function emote(name: keyof typeof emoji) {
      return client.emojis.cache.get(emoji[name]);
    }
  }
}