import { Client, Collection } from 'discord.js';

import { readdirSync } from 'fs';
import { resolve } from 'path';

import { Manager } from 'erela.js';
import Spotify from 'erela.js-spotify';

import { AppConfig } from './config/AppConfig';

export class SpotiKunay extends Client {
  constructor() {
    super(AppConfig);

    this.Commands = new Collection();
    this.Cooldowns = new Collection();

    this.onReady();
  }

  private async onReady() {
    // BOT CONNECTION //
    this.login();

    const EventsFolder = readdirSync(resolve(__dirname, 'events/client'), 'utf-8');
    for (const EventsFile of EventsFolder) {
      const EventImport = await import(resolve(__dirname, 'events/client', EventsFile));
      const Event = new EventImport.default();
      
      if (Event && Event.type) {
        this.on(Event.type, Event.execute.bind(null, this));
      }
    }

    console.log('[CLIENT] Events On Ready!');

    // ERELA CONNECTION //
    this.manager = new Manager({
      plugins: [
        new Spotify({
          clientID: process.env.S_CLIENT_ID,
          clientSecret: process.env.S_CLIENT_SECRET,
        }),
      ],
      nodes: [{
        identifier: 'SpotiKunay (NODE PRIVADO)',
        host: process.env.HOST,
        port: Number(process.env.PORT),
        password: process.env.PASSWORD,
      }],
      send: (id, payload) => {
        const guild = this.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    });

    const MusicFolder = readdirSync(resolve(__dirname, 'events/music'), 'utf-8');
    for (const MusicFile of MusicFolder) {
      const MusicImport = await import(resolve(__dirname, 'events/music', MusicFile));
      const Music = new MusicImport.default();

      if (MusicFile && Music.type) {
        this.manager.on(Music.type, (...args) => Music.execute(this, ...args));
      }
    }

    console.log('[CLIENT] Lavalink Starting...');
  }
}