import { Client, TextChannel } from "discord.js";
import { Player } from "erela.js";

export default class QueueEnd {
  type: string;
  
  constructor() {
    this.type = 'queueEnd'; 
  }

  run(client: Client<true>, player: Player) {
    if (player.queue.current) return;

    setTimeout(() => {
      const channel = client.channels.cache.get(player.textChannel) as TextChannel;
      channel?.send(`${client.emote('n')} Fim da fila, adiquira o **Premium** para usar o bot 24/7.`);

      player.destroy();
    }, 1000 * 60);
  }
 }