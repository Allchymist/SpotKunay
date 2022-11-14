import { Client, TextChannel } from "discord.js";
import { Player, Track, Payload } from "erela.js";

export default class TrackStuck {
  type: string;
  
  constructor() {
    this.type = 'trackStuck'; 
  }

  execute(client: Client<true>, player: Player, track: Track, payload: Payload) {
    const channel = client.channels.cache.get(player.textChannel) as TextChannel;
    channel?.send(`**${track.title}** falhou ao ser carregado.`);

    return player.messageId = null;
  }
}