import { CommandInteraction, GuildMember } from "discord.js";
import moment from "moment";
import 'moment-duration-format';

import Command from "../../Base";

export default class Play extends Command {
  constructor() {
    super();

    this.data = {
      name: 'play',
      description: 'Toque sua música. (Spotify|Youtube|SoundCloud)',
      options: [{
        name: 'title',
        description: 'Título ou link(URL) da música',
        type: 'STRING',
        required: true
      }]
    };

    this.inVoiceChannel = true;

  }

  async run(int: CommandInteraction) {
    const title = int.options.getString('title');

    int.editReply({
      embeds: [{
        color: 'BLUE', description: `${int.client.emote('load')} Procurando... \`${title}\``
      }]
    });

    const target = int.member as GuildMember;
    const player = int.client.Music.create({
      guild: int.guildId,
      textChannel: int.channelId,
      voiceChannel: target.voice.channelId,
      selfDeafen: true,
    });

    try {
      const search = await (await player.search(title, int.user));
      if (player.state !== 'CONNECTED') player.connect();

      if (search.loadType === 'PLAYLIST_LOADED') {
        search.tracks.forEach((track) => player.queue.add(track));

        const { playlist } = search;
        const select = playlist.selectedTrack;
        const totalTime = moment.duration(playlist.duration, "milliseconds").format('hh:mm:ss');

        if (player.playing && !player.paused && !player.queue.size) {
          int.editReply({
            embeds: [{
              color: 'BLUE', description: `${int.client.emote('y')} Playlist encontrada!`
            }]
          });

          return player.play();
        }

        return int.editReply({
          embeds: [{
            color: 'BLUE',
            thumbnail: { url: select?.thumbnail || '' },
            author: { name: 'Adicionado a fila!', icon_url: int.user.displayAvatarURL({ dynamic: true }) },
            description: `${int.client.emote('note')} [${playlist.name}](${title})\n\n` +
              `💿 Canal: _\`${select.author}\`_\n🕑 Duração: _\`${totalTime}\`_\n` +
              `📄 Quantidade: ${search.tracks.length} músicas`
          }]
        });
      } else {
        const track = search.tracks[0];
        player.queue.add(track);

        const time = moment.duration(track.duration, "milliseconds").format('hh:mm:ss');
        if (!player.playing && !player.paused && !player.queue.size) {
          int.editReply({
            embeds: [{
              color: 'BLUE', description: `${int.client.emote('y')} Música encontrada!`
            }]
          });

          return player.play();
        }

        return int.editReply({
          embeds: [{
            color: 'BLUE',
            thumbnail: { url: track.thumbnail || '' },
            author: { name: 'Adicionado a fila!', icon_url: int.user.displayAvatarURL({ dynamic: true }) },
            description: `${int.client.emote('note')} [${track.title}](${title})\n\n` +
              `💿 Canal: _\`${track.author}\`_\n🕑 Duração: _\`${time}\`_\n` +
              `📄 Posição: ${player.queue.size}º na Fila`
          }]
        });
      }
    } catch(err) {
      const { message } = err as Error;
      console.error(message);
      
      return int.editReply({
        embeds: [{
          color: 'RED', description: `${int.client.emote('n')} Ocorreu um erro ao reproduzir a música.`
        }]
      });
    }
  }
}