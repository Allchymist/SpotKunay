import { Client, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { resolve } from 'path';

import { CommandType } from '../@types/CommandType';

export async function DeployCommand(client: Client) {
  console.log('[CLIENT] Production Mode');

  const CommandsFolder = readdirSync(resolve(__dirname), 'utf-8').filter((file) => !file.startsWith('DeployCommands'));

  for (const CommandDir of CommandsFolder) {
    const CommandFiles = readdirSync(resolve(__dirname, CommandDir), 'utf-8');
    for (const CommandFile of CommandFiles) {
      const CommandImport = await import(resolve(__dirname, CommandDir, CommandFile));
      const Command: CommandType = new CommandImport.default();

      if (Command && Command.data) {
        client.Commands.set(Command.data.name, Command);
      }
    }
  }

  console.log('[CLIENT] Commands file Loaded on Collection');

  const data = client.Commands.map(({ data }) => data);

  // await client.guilds.cache.get('1040725831259009034').commands.set([]);

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log(`[CLIENT] Loading ${client.Commands.size} Commands`);

    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: [] }
    ) as any;

    console.log(`[CLIENT] ${data.length} Commands Loaded`)
  } catch (err) {
    console.error('Error on Load Commands', err);
  }

  return console.log('[CLIENT] Commands On Ready!');
}