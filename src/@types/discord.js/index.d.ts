import { Client, Collection } from 'discord.js';
import { Manager } from 'erela.js';

import { CommandType } from '../CommandType';

declare module 'discord.js' {
  export interface Client {
    Commands: Collection<string, CommandType>;
    Cooldowns: Collection<string, number>;
    manager: Manager;
  }
}