import { Client, Collection } from 'discord.js';
import { Manager } from 'erela.js';

import { CommandType } from '../CommandType';
import { Database } from '../../database';

declare module 'discord.js' {
  export interface Client {
    Commands: Collection<string, CommandType>;
    Cooldowns: Collection<string, number>;
    manager: Manager;
    Database: Database;
  }
}