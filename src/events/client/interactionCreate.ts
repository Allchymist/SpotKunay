import { Client, ClientEvents, GuildMember, Interaction } from "discord.js";

import moment from 'moment';
import 'moment-duration-format';

export default class InteractionCreate {
  type: keyof ClientEvents;

  constructor() {
    this.type = 'interactionCreate';
  }

  async execute(client: Client<true>, interaction: Interaction) {
    const target = interaction.member as GuildMember;

    if (interaction.isChatInputCommand()) {
      const command = client.Commands.get(interaction.commandName);

      if (command.inVoiceChannel && !target.voice.channelId) {
        return interaction.reply('Você precisa estar em um canal de voz.');
      }

      if (command.cooldown) {
        if (client.Cooldowns.has(`${interaction.user.id}-${interaction.commandName}`)) {
          const time = moment.duration(client.Cooldowns.get(`${interaction.user.id}-${interaction.commandName}`) - Date.now()).format('m [minutos] s [segundos]');
          return interaction.reply(`Você precisa esperar ${time} para usar este comando novamente.`);
        } else {
          client.Cooldowns.set(`${command.data.name}-${interaction.user.id}`, Date.now() + (command.cooldown * 1000));
          setTimeout(() => client.Cooldowns.delete(`${command.data.name}-${interaction.user.id}`), command.cooldown * 1000);
        }
      }

      try {
        await interaction.deferReply({
          ephemeral: command.ephemeral,
          fetchReply: true,
        });

        await command.execute(client, interaction);
      } catch (err) {
        const { message } = err as Error;
        console.error(message);
        
        return interaction.editReply(`Ocorreu um erro ao executar este comando.`)
      } finally {

      }
    }
  }
}