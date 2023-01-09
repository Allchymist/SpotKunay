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
    const Member = await client.Database.user.findById(target.id);
    if (!Member) {
      await new client.Database.user({
        _id: target.id,
        tag: target.user.tag,
        username: target.user.username,
        avatar:target.displayAvatarURL(),
        playlists: []
      }).save();
    }

    if (interaction.isChatInputCommand()) {
      await interaction.deferReply({
        fetchReply: true,
        ephemeral: true,
      });
      
      const command = client.Commands.get(interaction.commandName);
      if (command.inVoiceChannel && !target.voice.channelId) {
        return interaction.editReply('Você precisa estar em um canal de voz.');
      }

      if (command.cooldown) {
        if (client.Cooldowns.has(`${interaction.user.id}-${interaction.commandName}`)) {
          const time = moment.duration(client.Cooldowns.get(`${interaction.user.id}-${interaction.commandName}`) - Date.now()).format('m [minutos] s [segundos]');
          return interaction.editReply(`Você precisa esperar ${time} para usar este comando novamente.`);
        } else {
          client.Cooldowns.set(`${command.data.name}-${interaction.user.id}`, Date.now() + (command.cooldown * 1000));
          setTimeout(() => client.Cooldowns.delete(`${command.data.name}-${interaction.user.id}`), command.cooldown * 1000);
        }
      }

      try {
        let Guild = await client.Database.guild.findById(interaction.guildId);
        if (!Guild) {
          Guild = await new client.Database.guild({
            _id: interaction.guildId,
            isPremium: false
          }).save();
        }

        if (command.isPremium && !Guild.isPremium) {
          return interaction.editReply({
            embeds: [{
              color: 0xFF0000,
              description: 'Este servidor não é premium'
            }]
          });
        }

        await command.execute(client, interaction);
      } catch (err) {
        const { message } = err as Error;
        console.error(message);
        
        return interaction.editReply(`Ocorreu um erro ao executar este comando.`)
      }
    }

    if (interaction.isAutocomplete()) {
      const command = client.Commands.get(interaction.commandName);

      try {
        await command.autoComplete(client, interaction);
      } catch (error) {
        console.error(error);
      }
    }
  }
}