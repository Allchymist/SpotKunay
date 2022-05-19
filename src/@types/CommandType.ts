import { ApplicationCommandDataResolvable, CommandInteraction, PermissionString } from 'discord.js';

export type CommandType = {
  data: ApplicationCommandDataResolvable;

  bot_perm: PermissionString[];
  user_perm: PermissionString[];
  dj_perm: boolean;

  cooldown: number;
  inVoiceChannel: boolean;

  run(int: CommandInteraction): any | Promise<any>;
}