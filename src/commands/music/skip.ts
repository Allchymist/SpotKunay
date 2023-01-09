import { ApplicationCommandData, Client, ChatInputCommandInteraction } from "discord.js";

export default class Skip {
  data: ApplicationCommandData;
  cooldown: number;
  inVoiceChannel?: boolean;

  constructor() {
    this.data = {
      name: 'skip',
      description: 'Pular a música atual.',
    };

    this.inVoiceChannel = true;
    this.cooldown = 3;
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const player = client.manager.get(interaction.guildId);
    
    if (!player) return interaction.editReply(`Não há nenhuma música tocando!`);
    if (player.state !== 'CONNECTED') return interaction.editReply(`Não há nenhuma música tocando!`);

    player.stop();
  
    return interaction.editReply('pulando música...');
  }
}
