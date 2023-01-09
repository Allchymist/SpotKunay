import {
  ApplicationCommandData,
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  Client, GuildMember,
} from "discord.js";

import moment from 'moment';
import 'moment-duration-format';

export default class Play {
  data: ApplicationCommandData;
  cooldown: number;

  constructor() {
    this.data = {
      name: 'playlist',
      description: 'Configure a playlist salva.',
      options: [{
        name: 'play',
        description: 'Tocar playlist',
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
          name: 'options',
          description: 'O que deseja fazer com a fila de música atual?',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: 'Excluir fila e tocar playlist', value: 'reset-and-play' },
            { name: 'Adicionar playlist a fila', value: 'add-to-queue' },
          ]
        }]
      },
      {
        name: 'add',
        description: 'Adicionar música a playlist',
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
          name: 'title',
          description: 'Título ou link(URL) da música',
          type: ApplicationCommandOptionType.String,
          autocomplete: true,
          required: true
        }]
      },
      {
        name: 'delete',
        description: 'Excluir todas as músicas da playlist',
        type: ApplicationCommandOptionType.Subcommand
      },
      {
        name: 'config',
        description: 'Configurar/Remover/Tocar música da sua playlist...',
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
          name: 'title',
          description: 'Título da música salva na playlist',
          type: ApplicationCommandOptionType.String,
          autocomplete: true,
          required: true
        }, {
          name: 'options',
          description: 'O que deseja fazer com a música?',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: 'Tocar essa música', value: 'play' },
            { name: 'Tocar essa música em seguida', value: 'next' },
            { name: 'Adicionar música na fila', value: 'add' },
            { name: 'Ver detalhes dessa música', value: 'details' },
            { name: 'Remover essa música da playlist', value: 'remove' },
          ]
        }]
      }]
    }

    this.cooldown = 5;
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const cmd = interaction.options.getSubcommand();
    const member = interaction.member as GuildMember;

    try {
      const Member = await client.Database.user.findById(member.id);
      const Playlist = Member.playlists;

      if (cmd == 'play') {
        const option = interaction.options.getString('options');

        let player = client.manager.get(interaction.guildId);
        if (!player) {
          player = client.manager.create({
            guild: interaction.guildId,
            textChannel: interaction.channel.id,
            voiceChannel: member.voice.channelId,
            selfDeafen: true
          });
        }

        if (player.state !== 'CONNECTED') await player.connect();

        if (option == 'reset-and-play') {
          player.destroy(false);

          for (const tracks of Playlist) {
            const search = await player.search(tracks.url, interaction.user);
            player.queue.add(search.tracks[0]);
          }

          if (!player.playing && !player.paused && !player.queue.size) await player.play();

          return interaction.editReply({
            embeds: [{
              color: 0x0000FF,
              description: `Tocando sua playlist com ${Playlist.length} música(s)`
            }]
          });
        }

        if (option == 'add-to-queue') {
          for (const tracks of Playlist) {
            const search = await player.search(tracks.url, interaction.user);
            player.queue.add(search.tracks[0]);
          }

          if (!player.playing && !player.paused && !player.queue.size) await player.play();

          return interaction.editReply({
            embeds: [{
              color: 0x0000FF,
              description: `Sua playlist com ${Playlist.length} música(s) foi adicionado a fila`
            }]
          });
        }
      }
  
      if (cmd == 'add') {
        const title = interaction.options.getString('title');
        const search = await client.manager.search(title);
        const track = search.tracks[0];

        Playlist.push({
          name: track.title,
          url: track.uri,
          createdAt: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
        });

        await Member.updateOne({
          playlists: Playlist,
        }, { upsert: true });

        return interaction.editReply({
          embeds: [{
            color: 0x0000FF,
            description: 'Música adicionada a playlist.'
          }]
        });
      }
  
      if (cmd == 'config') {
        const title = interaction.options.getString('title');
        const option = interaction.options.getString('options');

        let player = client.manager.get(interaction.guildId);
          if (!player) {
            player = client.manager.create({
              guild: interaction.guildId,
              textChannel: interaction.channel.id,
              voiceChannel: member.voice.channelId,
              selfDeafen: true
            });
          }

        if (option == 'play') {
          if (player.state !== 'CONNECTED') await player.connect();

          const search = await player.search(title, interaction.user);
          const track = search.tracks[0];

          await player.play(track);

          return interaction.editReply({
            embeds: [{
              color: 0x0000FF,
              description: `[${track.title}](${track.uri}) Tocando da sua playlist`
            }]
          });
        }

        if (option == 'next') {
          if (player.state !== 'CONNECTED') await player.connect();

          const search = await player.search(title, interaction.user);
          const track = search.tracks[0];
          
          player.queue.unshift(track);

          if (!player.playing && !player.paused && !player.queue.size) await player.play();

          return interaction.editReply({
            embeds: [{
              color: 0x0000FF,
              description: 'A música será tocada na próxima'
            }]
          });
        }

        if (option == 'add') {
          if (player.state !== 'CONNECTED') await player.connect();

          const search = await player.search(title, interaction.user);
          const track = search.tracks[0];
          
          player.queue.add(track);

          if (!player.playing && !player.paused && !player.queue.size) await player.play();

          return interaction.editReply({
            embeds: [{
              color: 0x0000FF,
              description: 'A música foi adicionada a fila'
            }]
          });
        }

        if (option == 'details') {
          const search = await player.search(title, interaction.user);
          
          const findTrack = Playlist.find((track) => track.url == title);
          const track = search.tracks[0];

          return interaction.editReply({
            embeds: [{
              color:0x0000FF,
              title: track.title.length >= 50 ? track.title.substring(0, 50).padEnd(53, ".") : track.title,
              thumbnail: { url: track.thumbnail || interaction.guild.iconURL() },
              video: { url: track.uri } ,
              fields: [
                {
                  name: 'Canal',
                  value: track.author,
                  inline: true
                },
                {
                  name: 'Duração da música',
                  value: moment.duration(track.duration, "milliseconds").format("hh:mm:ss"),
                  inline: true
                },
                {
                  name: 'ﾠ',
                  value: 'ﾠ',
                  inline: true
                },
                {
                  name: 'Link da música',
                  value: `[Clique Aqui](${track.uri})`,
                  inline: true
                },
                {
                  name: 'Adicionado',
                  value: findTrack.createdAt,
                  inline: true
                }
              ]
            }]
          });
        }

        if (option == 'remove') {
          const findTrack = Playlist.find((track) => track.url == title);
          if (!findTrack) return interaction.editReply("Está música não está na sua playlist");

          const pos = Playlist.indexOf(findTrack)
          Playlist.splice(pos, 1);

          await Member.updateOne({
            playlists: Playlist
          }, { upsert: true });

          return interaction.editReply("Música removida da playlist");
        }
      }

      if (cmd == 'delete') {
        await Member.updateOne({
          playlists: []
        }, { upsert: true });

        return interaction.editReply({
          embeds: [{
            color: 0x0000FF,
            description: 'Todas as músicas das suas playlist foram deletadas'
          }]
        });
      }
    } catch (err) {
      console.error(err);

      return interaction.editReply({
        embeds: [{
          title: 'Ocorreu um erro ao reproduzir a música.',
          description: err.message
        }]
      });
    }
  }

  async autoComplete(client: Client, interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused();
    const cmd = interaction.options.getSubcommand();

    if (cmd == 'add') {
      const search = await client.manager.search(focusedValue);
  
      const tracks = search.tracks.slice(0, 25)
      .filter(({ title }) => title.includes(focusedValue))
      .map(({ title, uri}) => {
        const name = title.length >= 50 ? title.substring(0, 50).padEnd(53, ".") : title
  
        return { name, value: uri };
      });
  
      return await interaction.respond(tracks);
    }

    if (cmd == 'config') {
      const Member = await client.Database.user.findById(interaction.user.id);
      const Playlist = Member.playlists;

      if (Playlist.length < 1) return await interaction.respond([{ name: 'Não há músicas na playlist', value: '1' }]);

      const playlistMap = Playlist.slice(0, 25)
        .filter(({ name }) => name.includes(focusedValue))
        .map(({ name, url }) => {
          name = name.length >= 50 ? name.substring(0, 50).padEnd(53, ".") : name
          return { name, value: url };
        });

      return await interaction.respond(playlistMap);
    }
  }
}
