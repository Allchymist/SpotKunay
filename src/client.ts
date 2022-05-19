import { readdir, readdirSync } from 'fs';
import Spotify from 'erela.js-spotify';
import { Manager } from 'erela.js';
import { resolve } from 'path';
import djs from 'discord.js';

import { ClientOptions, emoji } from './config.json';
import { CommandType } from './@types/CommandType';

export default class Client {
  client: djs.Client<true>;
  
  constructor() {
    this.client = new djs.Client(ClientOptions as djs.ClientOptions); 

    this.client.SlashCommands = new djs.Collection();
    this.client.Cooldowns = new djs.Collection();
    this.Start();
  }

  private async Start() {
    await this.client.login();

    await this.LoadEvents();
    await this.LoadSlashCommands();

    this.client.Music = this.LoadLavalink(this.client);
  }

  private async LoadEvents() {
    const eventsDir = readdirSync(resolve(__dirname, 'events', 'client'));

    for (const file of eventsDir) {
      const Event = await (await import(resolve(__dirname, 'events', 'client', file)));
      const event = new Event.default();

      this.client.on(event.type, (...args) => event.run(this.client, ...args));
    }

    console.log(`Loaded ${eventsDir.length} events.`);
  }

  private async LoadSlashCommands() {
    const commandsDir = readdirSync(resolve(__dirname, 'commands', 'slash'));

    for (const dir of commandsDir) {
      const files = readdirSync(resolve(__dirname, 'commands', 'slash', dir));

      for (const file of files) {
        const Command = await (await import(resolve(__dirname, 'commands', 'slash', dir, file)));
        const cmd: CommandType = new Command.default();

        if (!cmd.data) continue;

        this.client.SlashCommands.set(cmd.data.name, cmd);
      }
    }

    this.client.guilds.cache.forEach((guild) => 
      guild.commands.set(this.client.SlashCommands.map(({ data}) => data))
    );

    console.log(`Loaded ${this.client.SlashCommands.size} slash commands.`);
  }

  private LoadLavalink(client: djs.Client<true>) {
    const manager = new Manager({
      plugins: [
        new Spotify({
          clientID: process.env.SPOTIFYID,
          clientSecret: process.env.SPOTIFYSECRET
        })
      ],
      nodes: [
        {
          identifier: 'SpotiKunay',
          host: process.env.HOST,
          port: Number(process.env.PORT),
          password: process.env.PASSWORD,
        }
      ],
      send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      }
    });

    readdir(resolve(__dirname, 'events', 'music'), async function (err, eventsDir) {
      if (err) return;

      for (const file of eventsDir) {
        const Event = await (await import(resolve(__dirname, 'events', 'music', file)));
        const event = new Event.default();

        manager.on(event.type, (...args) => event.run(client, ...args));
      }
    });

    console.log('Loaded Lavalink/Erela.');
    return manager;
  }

}