import { CommandInteraction } from "discord.js";

import Command from "../../Base";

export default class Stop extends Command {
  constructor() {
    super();

    this.data = {
      name: 'stop',
      description: 'Para a música atual.',
    };

    this.inVoiceChannel = true;
  }

  run(int: CommandInteraction) {
    const player = int.client.Music.get(int.guildId);

    if (!player) return int.editReply(`${int.client.emote('n')} Não há nenhuma música tocando!`);
    if (player.state !== 'CONNECTED') return int.editReply(`${int.client.emote('n')} Não há nenhuma música tocando!`);

    player.destroy();
  
    return int.editReply(`${int.client.emote('y')} Música parada!`);
  }

}