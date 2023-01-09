import { ApplicationCommandData, Client, ChatInputCommandInteraction, ApplicationCommandOptionType } from "discord.js";

export default class Loop {
  data: ApplicationCommandData;
  cooldown: number;
  isPremium: boolean;
  inVoiceChannel?: boolean;

  constructor() {
    this.data = {
      name: 'loop',
      description: '🌟 Configuração de loop da reprodução de música',
      options: [{
        name: 'option',
        description: 'Escolha qual das configurações voce deseja',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Loop de música', value: 'msc' },
          { name: 'Loop de fila', value: 'queue' },
          { name: 'Desativado', value: 'off' },
        ]
      }]
    }

    this.cooldown = 10;
    this.isPremium = true;
    this.inVoiceChannel = true;
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const player = client.manager.get(interaction.guildId);
    if (!player) return interaction.editReply('Não há músicas tocando');

    switch(interaction.options.getString('option')) {
      case "msc":
        player.setTrackRepeat(true);
        interaction.editReply("🔂 Repetindo Música!");
      break;
      case "queue":
        player.setQueueRepeat(true);
        interaction.editReply("🔁 Repetindo Fila!");
      break;
      case "off":
        player.setTrackRepeat(false);
        player.setQueueRepeat(false);

        interaction.editReply(`Loop desativado!`);
      break;
    }
  }
}