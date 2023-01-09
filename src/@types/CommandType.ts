import { ApplicationCommandData, CommandInteraction, Client, AutocompleteInteraction } from 'discord.js';

export type CommandType = {
  data: ApplicationCommandData;
  cooldown: number;
  inVoiceChannel?: boolean;
  isPremium: boolean;

  execute(client: Client, int: CommandInteraction): any | Promise<any>;
  autoComplete?(client: Client, interaction: AutocompleteInteraction): any | Promise<any>;
}