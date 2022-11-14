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

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log(`[CLIENT] Loading ${client.Commands.size} Commands`);

    const data = await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: client.Commands.map(({ data }) => data) }
    ) as any;

    console.log(`[CLIENT] ${data.length} Commands Loaded`)
  } catch (err) {
    console.error('Error on Load Commands', err);
  }

  return console.log('[CLIENT] Commands On Ready!');
}

export async function DeployCommandDevMode(client: Client<true>) {
  console.log('[CLIENT] Developer Mode');

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

  const GuildDev = client.guilds.cache.get("1040725831259009034");

  const data = client.Commands.map(({ data }) => data);
  await GuildDev.commands.set(data);

  return console.log('[CLIENT] Commands On Ready!');
}