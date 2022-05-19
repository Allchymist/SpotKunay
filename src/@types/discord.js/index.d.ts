import { Client, Collection, GuildEmoji } from 'discord.js';

import { emoji } from '../../config.json';
import { CommandType } from '../CommandType';
import { MusicType } from '../MusicType';

declare module 'discord.js' {
  export interface Client {
    SlashCommands: Collection<string, CommandType>;
    Cooldowns: Collection<string, number>;
    Music: MusicType;
    emote(name: keyof typeof emoji): GuildEmoji; 
  }
}