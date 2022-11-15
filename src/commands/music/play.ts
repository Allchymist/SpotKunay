import { ApplicationCommandData, ApplicationCommandOptionType, ChatInputCommandInteraction, Client, GuildMember } from "discord.js";

import moment from "moment";
import 'moment-duration-format';

export default class Play {
  data: ApplicationCommandData;
  cooldown: number;
  inVoiceChannel?: boolean;

  constructor() {
    this.data = {
      name: 'play',
      description: 'Toque sua música. (Spotify|Youtube|SoundCloud)',
      options: [{
        name: 'title',
        description: 'Título ou link(URL) da música',
        type: ApplicationCommandOptionType.String,
        required: true
      }]
    }

    this.inVoiceChannel = true;
    this.cooldown = 5;
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const title = interaction.options.getString('title');
    const msg = await interaction.editReply({
      embeds: [{
        description: `Procurando... \`${title}\``
      }]
    });

    const target = interaction.member as GuildMember;

    let player = client.manager.get(interaction.guildId);
    if (!player) {
      player = client.manager.create({
        guild: interaction.guildId,
        textChannel: interaction.channelId,
        voiceChannel: target.voice.channelId,
        selfDeafen: true,
      });
    } 
    
    player.messageId = msg.id;

    try {
      const search = await player.search(title, interaction.user);
      if (player.state !== 'CONNECTED') await player.connect();

      if (search.loadType === 'PLAYLIST_LOADED') {
        player.queue.concat(search.tracks);

        const { playlist } = search;
        const select = playlist.selectedTrack;
        const totalTime = moment.duration(playlist.duration, "milliseconds").format('hh:mm:ss');

        if (!player.playing && !player.paused && !player.queue.size) {
          return player.play();
        }

        return interaction.editReply({
          embeds: [{
            color: 0x00FF00,
            thumbnail: { url: select?.thumbnail || '' },
            author: { name: 'Adicionado a fila!', icon_url: interaction.user.displayAvatarURL() },
            description: `${playlist.name}\n\nDuração: _\`${totalTime}\`_\nQuantidade: ${search.tracks.length} músicas`
          }]
        });
      } else {
        const track = search.tracks[0];
        player.queue.add(track);

        const time = moment.duration(track.duration, "milliseconds").format('hh:mm:ss');
        if (!player.playing && !player.paused && !player.queue.size) {
          return player.play();
        }

        return interaction.editReply({
          embeds: [{
            color: 0x00FF00,
            thumbnail: { url: track.thumbnail || '' },
            author: { name: 'Adicionado a fila!', icon_url: interaction.user.displayAvatarURL() },
            description: `[${track.title}](${track.uri})\n\n` +
              `Canal: _\`${track.author}\`_\nDuração: _\`${time}\`_\n` +
              `Posição: ${player.queue.size}º na Fila`
          }]
        });
      }
    } catch(err) {
      console.error(err);

      return interaction.editReply({
        embeds: [{
          description: 'Ocorreu um erro ao reproduzir a música.'
        }]
      });
    }
  }
}