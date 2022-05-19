import { CommandInteraction } from "discord.js";

import Command from "../../Base";

export default class Skip extends Command {
  constructor() {
    super();

    this.data = {
      name: 'skip',
      description: 'Pular a música atual.',
    };

    this.inVoiceChannel = true;
  }

  run(int: CommandInteraction) {
    const player = int.client.Music.get(int.guildId);
    
    if (!player) return int.editReply(`${int.client.emote('n')} Não há nenhuma música tocando!`);
    if (player.state !== 'CONNECTED') return int.editReply(`${int.client.emote('n')} Não há nenhuma música tocando!`);

    player.stop();
  
    return int.editReply(`${int.client.emote('y')} Música parada!`);
  }

}