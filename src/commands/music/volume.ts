import { ApplicationCommandData, Client, ChatInputCommandInteraction, ApplicationCommandOptionType } from "discord.js";

export default class Loop {
  data: ApplicationCommandData;
  cooldown: number;
  isPremium: boolean;
  inVoiceChannel?: boolean;

  constructor() {
    this.data = {
      name: 'volume',
      description: '🌟 Configuração de volume da reprodução de música',
      options: [{
        name: 'height',
        description: 'Defina a altura do volume',
        type: ApplicationCommandOptionType.Number,
        required: true
      }]
    }

    this.cooldown = 10;
    this.inVoiceChannel = true;
    this.isPremium = true;
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const player = client.manager.get(interaction.guildId);
    if (!player) return interaction.editReply('Não há músicas tocando');

    const height = interaction.options.getNumber('height');
    if (height <= 0 || height > 200) return interaction.editReply("Valor inválido, apenas valores de 1 a 200");

    player.setVolume(height);

    return interaction.editReply(`Volume da reprodução alterado: \`${height}%\``);
  }
}