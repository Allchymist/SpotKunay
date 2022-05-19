import { Client, TextChannel } from "discord.js";
import { Player, Track, Payload } from "erela.js";

export default class TrackError {
  type: string;
  
  constructor() {
    this.type = 'trackError'; 
  }

  run(client: Client<true>, player: Player, track: Track, payload: Payload) {
    const channel = client.channels.cache.get(player.textChannel) as TextChannel;
    channel?.send(`${client.emote('n')} **${track.title}** falhou ao ser carregado.`);
  }
 }