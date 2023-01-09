import { ApplicationCommandData, Client, ChatInputCommandInteraction } from "discord.js";

export default class Stop {
  data: ApplicationCommandData;
  cooldown: number;
  inVoiceChannel?: boolean;

  constructor() {
    this.data = {
      name: 'stop',
      description: 'Para a música atual.',
    };

    this.inVoiceChannel = true;
  }

  execute(client: Client,interaction: ChatInputCommandInteraction) {
    const player = client.manager.get(interaction.guildId);

    if (!player) return interaction.editReply(`Não há nenhuma música tocando!`);
    if (player.state !== 'CONNECTED') return interaction.editReply(`Não há nenhuma música tocando!`);

    player.destroy();
  
    return interaction.editReply(`Música parada!`);
  }
}
