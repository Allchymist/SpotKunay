import { Client, TextChannel } from "discord.js";
import { Player } from "erela.js";

export default class QueueEnd {
  type: string;
  
  constructor() {
    this.type = 'queueEnd'; 
  }

  execute(client: Client<true>, player: Player) {
    player.messageId = null;

    setTimeout(() => {
      if (player.queue.current) return;

      const channel = client.channels.cache.get(player.textChannel) as TextChannel;
      channel?.send(`Fim da fila, adquira o **Premium** para usar o bot 24/7.`);

      return player.destroy();
    }, 1000 * 60);
  }
}