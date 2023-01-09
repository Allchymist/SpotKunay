import { ApplicationCommandData, Client, ChatInputCommandInteraction, ApplicationCommandOptionType } from "discord.js";

export default class Loop {
  data: ApplicationCommandData;
  cooldown: number;
  isPremium: boolean;
  inVoiceChannel?: boolean;

  constructor() {
    this.data = {
      name: 'resume',
      description: 'Retorne uma reprodução pausada'
    }

    this.cooldown = 3;
    this.isPremium = true;
    this.inVoiceChannel = true;
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const player = client.manager.get(interaction.guildId);
    if (!player) return interaction.editReply('Não há músicas tocando');

    player.pause(false);

    return interaction.editReply("Música retornada");
  }
}