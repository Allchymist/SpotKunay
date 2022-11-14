import { ApplicationCommandData, CommandInteraction, Client } from 'discord.js';

export type CommandType = {
  data: ApplicationCommandData;
  ephemeral: boolean;
  cooldown: number;
  inVoiceChannel?: boolean;

  execute(client: Client, int: CommandInteraction): any | Promise<any>;
}