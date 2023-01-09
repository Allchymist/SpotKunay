import {
  ApplicationCommandData,
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  Client, GuildMember,
} from "discord.js";

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
        autocomplete: true,
        required: true,
      }]
    }

    this.inVoiceChannel = true;
    this.cooldown = 5;
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const title = interaction.options.getString('title');
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

    try {
      const search = await player.search(title, interaction.user);
      if (player.state !== 'CONNECTED') await player.connect();

      if (search.loadType === 'PLAYLIST_LOADED') {
        search.tracks.forEach((track) => player.queue.add(track));
      
        console.log(player.queue.size);

        const { playlist } = search;
        const select = playlist.selectedTrack;
        const totalTime = moment.duration(playlist.duration, "milliseconds").format('hh:mm:ss');

        if (!player.playing && !player.paused && !player.queue.size) await player.play();

        return interaction.editReply({
          embeds: [{
            color: 0x00FF00,
            thumbnail: { url: select?.thumbnail || interaction.guild.iconURL() },
            author: { name: 'Adicionado a fila!', icon_url: interaction.user.displayAvatarURL() },
            description: `Nome: _\`${playlist?.name || 'Playlist Desconhecida'}\`_\n\nDuração: _\`${totalTime}\`_\nQuantidade: ${search.tracks.length} músicas`
          }]
        });
      } else {
        const track = search.tracks[0];

        if (!player.playing && !player.paused && !player.queue.size) await player.play(track);
        else player.queue.add(track);

        const time = moment.duration(track.duration, "milliseconds").format('hh:mm:ss');

        return interaction.editReply({
          embeds: [{
            color: 0x00FF00,
            thumbnail: { url: track.thumbnail || interaction.guild.iconURL() },
            author: { name: 'Adicionado a fila!', icon_url: interaction.user.displayAvatarURL() },
            description: `[${track.title}](${track.uri})\n\n` +
              `Canal: _\`${track.author}\`_\nDuração: _\`${time}\`_\n` +
              `Posição: _\`${player.queue.size}º na Fila\`_`
          }]
        });
      }
    } catch(err) {
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
    const search = await client.manager.search(focusedValue);

    const tracks = search.tracks.slice(0, 25)
    .filter(({ title }) => title.includes(focusedValue))
    .map(({ title, uri}) => {
      const name = title.length >= 50 ? title.substring(0, 50).padEnd(53, ".") : title

      return { name, value: uri };
    });

    return await interaction.respond(tracks);
  }
}
