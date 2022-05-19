import { Client, GuildMember, Interaction } from "discord.js";
import moment from 'moment';
import 'moment-duration-format';

import { Perms } from '../../config.json';

export default class InteractionCreate {
  type: string;

  constructor() {
    this.type = 'interactionCreate';
  }

  async run(client: Client<true>, int: Interaction) {
    if (int.isCommand()) {
      const command = client.SlashCommands.get(int.commandName);
      await int.deferReply({ fetchReply: true });

      if (command.bot_perm) {
        if (!int.guild.me.permissions.has(command.bot_perm))
          return int.editReply(`${client.emote('n')} Eu não tenho permissão para isso.\n\n` +
          `Permissões necessárias: ${command.bot_perm.map((p) => Perms[p]).join(', ')}`);
      }

      if (command.user_perm) {
        if (!int.memberPermissions.has(command.user_perm))
          return int.editReply(`${client.emote('n')} Você não tem permissão para isso.\n\n` +     
          `Permissões necessárias: ${command.user_perm.map((p) => Perms[p]).join(', ')}`);
      }

      if (command.inVoiceChannel) {
        const target = int.member as GuildMember;
        if (!target.voice.channelId) return int.editReply(`${client.emote('n')} Você precisa estar em um canal de voz.`);
      }

      if (command.cooldown) {
        if (client.Cooldowns.has(`${int.user.id}-${int.commandName}`)) {
          const time = moment.duration(client.Cooldowns.get(`${int.user.id}-${int.commandName}`) - Date.now()).format('m [minutos], s [segundos]');
          return int.editReply(`${client.emote('n')} Você precisa esperar ${time} para usar este comando novamente.`);
        } else {
          client.Cooldowns.set(`${command.data.name}-${int.user.id}`, Date.now() + (command.cooldown * 1000));
          setTimeout(() => client.Cooldowns.delete(`${command.data.name}-${int.user.id}`), command.cooldown * 1000);
        }
      }

      try {
        await (await command.run(int));
      } catch (err) {
        const { message } = err as Error;
        console.error(message);
        
        return int.editReply(`${client.emote('n')} Ocorreu um erro ao executar este comando.`)
      }
    }
  }
}